import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RefreshTokenDto {
  @ApiProperty({
    description: 'JWT access token',
  })
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}

