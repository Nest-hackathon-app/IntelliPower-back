//TODO add images caching +retries caching
import { HttpService } from '@nestjs/axios';
import {
  HttpException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { match } from 'assert';
import { AxiosResponse, isAxiosError } from 'axios';
import * as FormData from 'form-data';
import { catchError } from 'rxjs';
import { PrismaService } from 'src/db/prisma.service';
import { RedisService } from 'src/redis/redis.service';
import { MQTT_PUBLISHER } from 'src/utils/constants';
import { isAggregateError } from 'src/utils/typeGuard/isAggregateError';

export interface FaceRecognitionResponse {
  match: boolean;
}
export interface EmotionRecognitionResponse {
  anger: number;
  fear: number;
}
export interface AiResponse {
  face_recognition: FaceRecognitionResponse;
  emotion_recognition: EmotionRecognitionResponse;
}
@Injectable()
export class FaceRecoService {
  LOGIN_ATTEMPTS = 3;
  constructor(
    private readonly http: HttpService,
    private readonly db: PrismaService,
    @Inject(MQTT_PUBLISHER) private readonly client: ClientProxy,
    private readonly redis: RedisService,
  ) {}
  async processImage(file: Express.Multer.File) {
    const form1 = new FormData();
    form1.append('file', file.buffer, {
      filename: file.originalname,
      contentType: file.mimetype,
    });
    try {
      const url =
        'https://b835-41-111-161-82.ngrok-free.app/analyze_face_and_emotion';
      const res = await this.http.axiosRef.post<AiResponse>(url, form1, {
        headers: {
          ...form1.getHeaders(),
        },
      });
      return res.data;
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        throw new HttpException(
          error.response?.statusText ?? 'unknown error',
          error.response?.status ?? 500,
        );
      }
    }
  }
  async subtractLoginAttempt(userId: string) {
    const loginAttempts = await this.redis.get<number>(userId);
    if (loginAttempts == this.LOGIN_ATTEMPTS - 1) {
      await this.redis.delete(userId);
      this.client.emit('buzzing', { type: 'login Failure' });
      return;
    }

    if (!loginAttempts) {
      await this.redis.setWithTtl(userId, 1, 60);
    }
    if (loginAttempts) {
      await this.redis.setWithoutReset(userId);
    }
  }
  //TODO user info will be added aswell to the response
  async authenticateFace(
    file: Express.Multer.File,
  ): Promise<{ match: boolean }> {
    const base64 = file.buffer.toString('base64');
    const baseUrl = 'https://b15d-41-111-161-82.ngrok-free.app';
    const base64Users = await this.db.user.findMany({
      select: {
        image: true,
        name: true,
      },
    });

    try {
      const result = await Promise.any<AxiosResponse<FaceRecognitionResponse>>(
        base64Users.map(async (user) => {
          console.log('scanning user:', user.name);
          const res = await this.http.axiosRef.post<FaceRecognitionResponse>(
            baseUrl + '/auth',
            {
              expected_image_base64: user.image,
              auth_image_base64: base64,
            },
          );

          if (res.data.match === true) return res;
          throw new Error('No match'); // Forces Promise.any to keep looking
        }),
      );

      if (!result) {
        throw new HttpException('No matching face found', 404);
      }
      //Open the door after being authed
      this.openDoor();
      return {
        // eslint-disable-next-line prettier/prettier
      match:result.data.match,
      };
    } catch (error: unknown) {
      if (isAggregateError(error)) {
        await this.subtractLoginAttempt('figureOutId');
        throw new HttpException('No matching face found', 404);
      }

      throw new InternalServerErrorException();
    }
  }
  openDoor() {
    this.client.emit('open_door', { user: 'AIIII' });
  }
}
