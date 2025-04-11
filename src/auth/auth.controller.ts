import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { localGuard } from './guards/local.guard';
import { currentUser } from './decorators/getUser.decorator';
import { user } from '@prisma/client';
import { AuthService } from './auth.service';
import { RefreshTokenDto } from './dto/refreshTokenDto';
import { ConfigService } from '@nestjs/config';
import { refreshToken } from './dto/refreshToken.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { loginReqDto } from './dto/login.req.dto';
import { LoginResDto } from './dto/login.res.dto';
import { jwtGuard } from './guards/jwt.guard';
import { Roles } from './decorators/userRole.decorator';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { RoleGuard } from './guards/role.guard';
import { UpdateUserDto } from 'src/user/dto/update-user.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authServices: AuthService,
    private readonly ConfigService: ConfigService,
  ) {}
  @ApiOperation({ summary: 'Login to an existing account' })
  @ApiBody({ type: loginReqDto })
  @ApiResponse({
    status: 200,
    description: 'Login Successful',
    type: LoginResDto,
  })
  @ApiResponse({ status: 401, description: 'Wrong Credentials' })
  @Post('login')
  @UseGuards(localGuard)
  login(@currentUser() user: user) {
    return this.authServices.login(user);
  }
  @Post('refresh')
  @ApiOperation({ summary: 'Refresh the access token' })
  @ApiBody({ type: RefreshTokenDto })
  @ApiResponse({
    status: 200,
    description: 'Refresh Token Successful',
    type: refreshToken,
  })
  @ApiResponse({ status: 401, description: 'Invalid Refresh Token' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'User not found' })
  refreshToken(@Body() body: RefreshTokenDto): refreshToken {
    return this.authServices.validateRefreshToken(body.refreshToken);
  }
  @UseGuards(jwtGuard, RoleGuard)
  @Roles('admin')
  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: 201,
    description: 'User registered successfully',
    type: LoginResDto,
  })
  @ApiResponse({ status: 400, description: 'User already exists' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async register(
    @Body() user: CreateUserDto,
    @currentUser() curr: user,
  ): Promise<LoginResDto> {
    return this.authServices.register(user, curr.companyId);
  }
  @UseGuards(jwtGuard)
  @Roles('admin')
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user' })
  @ApiResponse({
    status: 200,
    description: 'User deleted successfully',
  })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'User not found' })
  deleteUser(@currentUser() user: user, @Param('id') id: string) {
    return this.authServices.deleteUser(id, user.id);
  }
  @Roles('admin')
  @Patch(':id')
  @ApiOperation({ summary: 'Update a employee' })
  @ApiResponse({
    status: 200,
    description: 'Employee updated successfully',
  })
  @ApiResponse({ status: 404, description: 'Forbidden or user not found' })
  @ApiBody({ type: UpdateUserDto })
  @ApiBearerAuth()
  updateUser(@Param('id') id: string, @Body() data: UpdateUserDto) {
    return this.authServices.updateUser(data, id);
  }
}
