import { Injectable } from '@nestjs/common';
import { async } from 'rxjs';
import { PrismaService } from 'src/db/prisma.service';
import { createAnomalyDto } from './dto/create-anomaly.dto';

@Injectable()
export class AnomaliesService {
  constructor(private readonly prisma: PrismaService) {}
  getAnomaliesOfCompany(companyId: string) {
    return this.prisma.anomaly.findMany({
      where: {
        area: {
          floor: {
            companyId,
          },
        },
      },
      orderBy: {
        reportedAt: 'desc',
      },
    });
  }
  async getAnomaliesByAreaId(areaId: string) {
    return this.prisma.anomaly.findMany({
      where: {
        areaId,
      },
      orderBy: {
        reportedAt: 'desc',
      },
    });
  }
  async getAnomaliesByFloorId(floorId: string) {
    return this.prisma.anomaly.findMany({
      where: {
        area: {
          floorId,
        },
      },
      orderBy: {
        reportedAt: 'desc',
      },
    });
  }
  async reportAnomaly(data: createAnomalyDto) {
    return this.prisma.anomaly.create({
      data: {
        title: data.anomalyTitle,
        areaId: data.areaId,
        status: data.anomalyStatus,
      },
    });
  }
  async reportAnomalyResolved(anomalyId: string) {
    return this.prisma.anomaly.update({
      where: {
        id: anomalyId,
      },
      data: {
        status: 'resolved',
        resolvedAt: new Date(),
      },
    });
  }
}
