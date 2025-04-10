import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { jwtPayload } from '../interfaces/jwtPayload';
import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/user/user.service';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class jwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private userService: UsersService,
    private readonly jwtService: JwtService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.getOrThrow('ACCESS_TOKEN_SECRET'),
    });
  }

    // validate function is called when the token is verified
  async validate(payload: jwtPayload) {
    return this.userService.findOne(payload.id);
  }
}
