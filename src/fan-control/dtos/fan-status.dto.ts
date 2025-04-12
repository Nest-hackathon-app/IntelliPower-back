import { ApiProperty } from "@nestjs/swagger";
import { FanStatus } from "@prisma/client";

export class fanStatusChangeResponseDto{
  @ApiProperty({ name: 'fanId', description: 'The id of the fan' })
  fanId: string;
  @ApiProperty({ description: 'The status of the fan', enum: FanStatus })
  status:FanStatus;
}
