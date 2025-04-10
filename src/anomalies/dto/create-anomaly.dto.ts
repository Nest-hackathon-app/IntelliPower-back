import { ApiProperty } from "@nestjs/swagger";
import { AnomalyStatus } from "@prisma/client";
import { IsDateString, IsString } from "class-validator";

export class createAnomalyDto {
  @IsString()
  @ApiProperty()
  anomalyTitle: string;
  @IsString()
  @ApiProperty()
  anomalyStatus: AnomalyStatus;
  @IsString()
  @ApiProperty()
  areaId: string;
  @IsDateString()
  @ApiProperty()
  reportedAt: Date;
  @ApiProperty()
  @IsDateString()
  resolvedAt: Date;
}
