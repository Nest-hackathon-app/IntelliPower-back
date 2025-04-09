import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/db/prisma.service';

@Injectable()
export class TemperatureService {
  constructor(private readonly prisma: PrismaService) {}
}
