import { ApiProperty } from "@nestjs/swagger";

export class refreshToken {
  @ApiProperty({})
  accessToken: string;
  @ApiProperty({})
  refreshToken: string;
}
