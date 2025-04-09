import {
  Body,
  Controller,
  ParseFilePipeBuilder,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FloorPlanService } from './floor-plan.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('floor-plan')
export class FloorPlanController {}
