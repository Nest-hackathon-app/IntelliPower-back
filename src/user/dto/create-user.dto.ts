import { ApiProperty} from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { IsEmail, IsEnum, IsNotEmpty, IsString, IsStrongPassword } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ name: 'name', description: 'The name of the user' })
  @IsString({ message: 'name must be provided' })
  readonly name: string;
  @ApiProperty({ name: 'email', description: 'The email of the user' })
  @IsEmail({}, { message: 'email is invalid' })
  readonly email: string;
  @ApiProperty({ name: 'password', description: 'The password of the user' })
  @IsString()
  @IsNotEmpty()
    password: string;
  @ApiProperty({ description: 'User Role', enum: UserRole })
  @IsEnum(UserRole)
  role: UserRole;
}
