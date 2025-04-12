import { HttpService } from '@nestjs/axios';
import { HttpException, Injectable } from '@nestjs/common';
import { AxiosResponse, isAxiosError } from 'axios';
import * as FormData from 'form-data';
import { BuzzerService } from 'src/buzzer/buzzer.service';
import { PrismaService } from 'src/db/prisma.service';
import { RedisService } from 'src/redis/redis.service';
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
  private readonly LOGIN_ATTEMPTS = 3;
  constructor(
    private readonly http: HttpService,
    private readonly db: PrismaService,
    private readonly redis: RedisService,
    private readonly buzzer: BuzzerService,
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

  async authenticateFace(file: Express.Multer.File, cameraId: string) {
    try {
      const base64 = file.buffer.toString('base64');
      const url = 'https://b835-41-111-161-82.ngrok-free.app/auth';
      const base64onlyAdmin = await this.db.user.findMany({
        select: {
          image: true,
        },
      });
      const result = await Promise.any<AxiosResponse<FaceRecognitionResponse>>(
        base64onlyAdmin.map(async (admin) => {
          return new Promise((resolve, reject) => {
            this.http.axiosRef
              .post<FaceRecognitionResponse>(url, {
                expected_image_base64: admin.image,
                auth_image_base64: base64,
              })
              .then((res) => {
                if (res.data.match === true) {
                  resolve(res);
                }
              })
              .catch((err) => {
                reject(new Error('Error during face recognition: ' + err));
              });
          });
        }),
      );

      if (!result) {
        throw new HttpException('No matching face found', 404);
      }
      return {
        match: result.data.match,
      };
    } catch (error) {
      if (isAggregateError(error)) {
        await this.subtractTry(cameraId);
      }
    }
  }
  async subtractTry(cameraId: string) {
    const loginAttempts = await this.redis.get<number>(cameraId);

    // First failed attempt
    if (!loginAttempts) {
      await this.redis.setWithTtl(cameraId, 1, 60);
      return;
    }

    // Subsequent attempts
    const newCount = loginAttempts + 1;

    // Don't reset TTL - use Redis's TTL persistence
    await this.redis.incr(cameraId); // Or implement a setWithoutTtlReset

    if (newCount === this.LOGIN_ATTEMPTS - 1) {
      await this.redis.delete(cameraId);
      this.buzzer.sendBuzzSignal(cameraId);
    }
  }
}
