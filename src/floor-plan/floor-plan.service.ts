/* eslint-disable @typescript-eslint/no-unsafe-return */
import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/db/prisma.service';
import { CreateFloorDto } from './dto/create-floor.dto';
import { AreaResponseDto, FloorResponseDto } from './dto/floor-response.dto';
import { HttpService } from '@nestjs/axios';
import * as FormData from 'form-data';
import { tap } from 'rxjs';
import { mapToFloorPlanData } from 'src/utils/flat.util';
import { sampleFloor } from 'src/seeders/data/rack.data';
export interface AiReturnResponse {
  output: string;
}
@Injectable()
export class FloorPlanService {
  constructor(
    private readonly http: HttpService,
    private readonly prisma: PrismaService,
  ) {}
  async getFloorPlan(file: Express.Multer.File) {
    console.log('Processing file with AIIIII:', file);
    for (let i = 0; i < 1000000000; i++) {
      // Simulate some processing
    }
    const form = new FormData();
    form.append('file', file.buffer, {
      filename: file.originalname,
      contentType: file.mimetype,
    });

    const response = await this.http.axiosRef.post<AiReturnResponse>(
      'https://mn2r.app.n8n.cloud/webhook-test/2b3f812a-2f07-436b-abb9-f3d16e6c6a06',
      form,
      {
        headers: {
          ...form.getHeaders(),
        },
      },
    );
    return this.jsonPipeLine(response.data.output);
  }
  getCompanyFloorPlans(companyId: string) {
    return this.prisma.floor.findMany({
      where: { companyId },
      orderBy: { order: 'asc' },
      select: {
        name: true,
        id: true,
        areas: {
          select: {
            name: true,
            id: true,
          },
        },
      },
    });
  }
  async addFloorToCompany(
    data: CreateFloorDto,
    companyId: string,
  ): Promise<FloorResponseDto> {
    // Check if the floor already exists for the companyId

    const existingFloor = await this.prisma.floor.findFirst({
      where: {
        order: data.order,
      },
    });
    //if it does exist increment the all the above its order by 1
    if (existingFloor) {
      await this.prisma.floor.updateMany({
        where: {
          companyId,
          order: { gte: existingFloor.order },
        },
        data: {
          order: { increment: 1 },
        },
      });
    }
    //Else create the new floor
    return this.prisma.floor.create({
      data: {
        ...data,
        company: { connect: { id: companyId } },
      },
    });
  }
  async getFloorAreas(floorId: string): Promise<AreaResponseDto[] | undefined> {
    const floorArease = await this.prisma.floor.findUnique({
      where: { id: floorId },
      select: {
        areas: true,
      },
    });
    return floorArease?.areas;
  }
  async getArea(areaId: string) {
    return this.prisma.area.findUnique({
      where: { id: areaId },
      include: {
        cameras: true,
        sensor: true,
      },
    });
  }
  jsonPipeLine(json: string) {
    const cleanedText = json.replace(/^```json\s*/i, '').replace(/```$/, '');

    return JSON.parse(cleanedText);
  }
  getMockFloorPlan(){
    return mapToFloorPlanData(sampleFloor); 
  }
 

}
