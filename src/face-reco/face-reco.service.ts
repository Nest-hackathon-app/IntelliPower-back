import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import * as FormData from 'form-data';

export interface FaceRecognitionResponse {
  match: boolean;
}
export interface EmotionRecognitionResponse {
  anger: number;
  fear: number;
}
@Injectable()
export class FaceRecoService {
  constructor(private readonly http: HttpService) {}
  async processImage(file: Express.Multer.File) {
    const form1 = new FormData();
    form1.append('file', file.buffer, {
      filename: file.originalname,
      contentType: file.mimetype,
    });

    const form2 = new FormData();
    form2.append('file', file.buffer, {
      filename: file.originalname,
      contentType: file.mimetype,
    });
    const url = 'https://b835-41-111-161-82.ngrok-free.app/face_recognition';
    const url2 =
      'https://b835-41-111-161-82.ngrok-free.app/emotion_recognition';
    const [res1, res2] = await Promise.all([
      this.http.axiosRef.post<FaceRecognitionResponse>(url, form1, {
        headers: {
          ...form1.getHeaders(),
        },
      }),
      this.http.axiosRef.post<EmotionRecognitionResponse>(url2, form2, {
        headers: {
          ...form2.getHeaders(),
        },
      }),
    ]);
    return { ...res1.data, ...res2.data };
  }
}
