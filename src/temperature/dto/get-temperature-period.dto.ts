import { ApiProduces, ApiProperty } from "@nestjs/swagger";

export class GetPeriodDataDto {
  @ApiProperty()
  startDate: Date;
  @ApiProperty()
  endDate: Date;
}
