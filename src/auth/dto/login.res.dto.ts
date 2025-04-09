import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { user } from '@prisma/client';
import { IsString } from 'class-validator';
import { UserResponseDto } from 'src/user/dto/user-response.dto';

export class LoginResDto {
  @ApiProperty({
    name: 'accessToken',
    description: 'JWT access token',
  })
  @IsString()
  accessToken: string;
  @ApiProperty({
    name: 'refreshToken',
    description: 'JWT refresh token',
  })
  @IsString()
  refreshToken: string;
  @ApiProperty({ description: 'User INfo' })
  user: UserResponseDto;
}
