import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ExtendedRequest } from '../interfaces/extended.req';

export const currentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest<ExtendedRequest>();
    return req.user;
  },
);
