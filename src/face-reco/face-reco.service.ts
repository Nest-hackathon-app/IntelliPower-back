import { HttpService } from '@nestjs/axios';
import { HttpException, Injectable } from '@nestjs/common';
import { AxiosResponse, isAxiosError } from 'axios';
import * as FormData from 'form-data';
import { BuzzerService } from 'src/buzzer/buzzer.service';
import { PrismaService } from 'src/db/prisma.service';
import { DoorService } from 'src/door/door.service';
import { RedisService } from 'src/redis/redis.service';
import { isAggregateError } from 'src/utils/typeGuard/isAggregateError';
import * as NodeWebcam from 'node-webcam';
export interface FaceRecognitionResponse {
  match: boolean;
  auth_id: string;
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
  closeDoor(cameraId: string) {
    return this.db.door.update({
      where: {
        id: cameraId,
      },
      data: {
        status: 'closed',
      },
    });
  }
  webcam = NodeWebcam.create({
    width: 1280,
    height: 720,
    quality: 100,
    saveShots: true,
    output: 'jpeg',
    device: '/dev/video0',
    callbackReturn: 'base64',
    verbose: false,
  });

  private readonly LOGIN_ATTEMPTS = 3;
  constructor(
    private readonly http: HttpService,
    private readonly db: PrismaService,
    private readonly redis: RedisService,
    private readonly buzzer: BuzzerService,
    private readonly doorService: DoorService,
  ) {}
  async processImage(file: Express.Multer.File) {
    const form1 = new FormData();
    form1.append('file', file.buffer, {
      filename: file.originalname,
      contentType: file.mimetype,
    });
    try {
      const url = 'http://10.42.0.109:8000/auth';
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
  async authenticateFace(cameraId: string) {
    try {
      console.log('Starting face recognition process...');
      const base64 = await new Promise<string>((resolve, reject) => {
        this.webcam.capture('temp', (err, data) => {
          console.log('Init capture');
          if (err) {
            console.error('Error capturing image:', err);
            return reject(err);
          }
          if (typeof data !== 'string') {
            console.error('Captured data is not a string:', data);
            return reject(new Error('Captured data is not a string'));
          }
          resolve(data);
        });
      });

      // Log the length of captured base64 to verify it's not empty
      console.log('Captured base64 length:', base64.length);

      const cleanedBase64 = base64.replace(/^data:image\/[a-z]+;base64,/, '');
      const url = 'http://10.42.0.109:8000/auth';

      // Fetch admin images from database
      const adminUsers = await this.db.user.findMany({
        select: {
          image: true,
          id: true,
        },
        where: {
          image: {
            not: null,
          },
        },
      });

      const getCOmpanyId = await this.db.camera.findUnique({
        where: {
          id: cameraId,
        },
        select: {
          Area: {
            select: {
              floor: {
                select: {
                  companyId: true,
                },
              },
            },
          },
        },
      });
      if (adminUsers.length === 0) {
        console.log('No admin users found in database');
        throw new HttpException('No admin users found', 404);
      }

      console.log(`Found ${adminUsers.length} admin users to compare against`);

      try {
        // Modify the Promise.any implementation to properly handle rejections and matches
        const result = await Promise.any(
          adminUsers.map(async (admin) => {
            // Ensure admin image exists and has content
            if (!admin.image || admin.image.length === 0) {
              return Promise.reject(
                new Error('Empty reference image found in database'),
              );
            }

            console.log('Sending comparison request to API');

            return this.http.axiosRef
              .post<FaceRecognitionResponse>(
                url,
                {
                  expected_image_base64: admin.image,
                  auth_image_base64: cleanedBase64,
                  auth_id: admin.id,
                },
                {
                  headers: {
                    'Content-Type': 'application/json', // Fixed header name
                  },
                },
              )
              .then((res) => {
                console.log('API response:', res.data);
                // Return the response regardless of match status so we can handle it later
                return res;
              });
          }),
        ).catch((err) => {
          console.error('All face recognition attempts failed:', err);

          // If it's an AggregateError, log the specific errors
          if (err instanceof AggregateError && err.errors) {
            err.errors.forEach((e, i) => {
              console.error(`Error ${i + 1}:`, e.message);
            });
          }
          throw new HttpException(
            'Face recognition failed: No matches found',
            401,
          );
        });

        if (!getCOmpanyId?.Area?.floor.companyId){
          console.error('Company ID not found in camera data');
          throw new HttpException('Company ID not found', 404);
        }
        // Check if we got a result and if it's a match
        if (result.data.match === true) {
          console.log('Face recognized successfully');
          return this.doorService.openDoor(
            cameraId,
            getCOmpanyId?.Area?.floor.companyId,
            
            result.data.auth_id,
          );
        } else {
          console.log('No matching face found in results');
          return {
            match: false,
          };
        }
      } catch (error) {
        console.error('Error in face recognition process:', error);
        throw new HttpException('Face recognition process failed', 500);
      }
    } catch (error) {
      if (isAggregateError(error)) {
        console.error('Aggregate error:', error);
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
