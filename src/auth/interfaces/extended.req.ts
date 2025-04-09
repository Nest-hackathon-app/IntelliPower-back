import { user } from '@prisma/client';

export interface ExtendedRequest extends Request {
  user: user;
}
