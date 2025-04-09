import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { jwtPayload } from '../interfaces/jwtPayload';
import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/user/user.service';
import { ExtractJwt, Strategy } from 'passport-jwt';
@Injectable()
export class jwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private userService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.getOrThrow('ACCESS_TOKEN_SECRET'),
    });
  }
  async validate(payload: jwtPayload) {
    return this.userService.findOne(payload.id);
  }
}
