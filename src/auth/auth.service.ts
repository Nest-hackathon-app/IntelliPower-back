import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { user } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { LoginResDto } from './dto/login.res.dto';
import { refreshToken } from './dto/refreshToken.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { jwtPayload } from './interfaces/jwtPayload';
import { UsersService } from 'src/user/user.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtModule: JwtService,
    private readonly configService: ConfigService,
  ) {}
  async getUserById(id: string): Promise<user> {
    return this.userService.findOne(id);
  }
  async register(user: CreateUserDto): Promise<LoginResDto> {
    try {
      const newUser = await this.userService.create(user);
      return this.login(newUser);
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError)
        throw new HttpException(
          'User Already Exist Please login With your Email and Password',
          HttpStatus.BAD_REQUEST,
        );
    }
    throw new HttpException(
      'Something went wrong, please try again',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }

  async deleteUser(id: string, uid: string) {
    return this.userService.remove(id, uid);
  }

  async validateUser(email: string, password: string): Promise<user> {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('email or password is incorrect');
    }
    const isAuth = await bcrypt.compare(password, user.password);
    if (!isAuth) {
      throw new UnauthorizedException('email or password is incorrect');
    }
    return user;
  }
  async login(user: user): Promise<LoginResDto> {
    const payload = { id: user.id };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtModule.signAsync(payload, {
        secret: this.configService.get('ACCESS_TOKEN_SECRET'),
        expiresIn: this.configService.get('ACCESS_TOKEN_EXPIRES_IN'),
      }),
      this.jwtModule.signAsync(payload, {
        expiresIn: this.configService.get('REFRESH_TOKEN_EXPIRES_IN'),
        secret: this.configService.get('REFRESH_TOKEN_SECRET'),
      }),
    ]);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = user;
    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
      user: result,
    };
  }
  validateRefreshToken(token: string): refreshToken {
    const payload = this.jwtModule.verify<jwtPayload>(token, {
      secret: this.configService.getOrThrow('REFRESH_TOKEN_SECRET'),
    });
    const newPayload = { id: payload.id };
    const newAccessToken = this.jwtModule.sign(newPayload, {
      secret: this.configService.getOrThrow('ACCESS_TOKEN_SECRET'),
      expiresIn: this.configService.getOrThrow('ACCESS_TOKEN_EXPIRES_IN'),
    });
    const newRefreshToken = this.jwtModule.sign(newPayload, {
      expiresIn: this.configService.getOrThrow('REFRESH_TOKEN_EXPIRES_IN'),
      secret: this.configService.getOrThrow('REFRESH_TOKEN_SECRET'),
    });
    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }
}
