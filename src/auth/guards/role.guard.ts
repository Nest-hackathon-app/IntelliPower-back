import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ExtendedRequest } from '../interfaces/extended.req';
import { Reflector } from '@nestjs/core';
import { rolesKey } from '../decorators/userRole.decorator';
import { UserRole } from '@prisma/client';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      rolesKey,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredRoles) {
      return true;
    }
     const req = context.switchToHttp().getRequest<ExtendedRequest>();
    if (!req.user) {
      return false;
    }
    const userRole = req.user.role;

    return this.matchRoles(userRole, requiredRoles);
  }
  matchRoles(
    userRole: string,
    requiredRoles: UserRole[],
  ): boolean | Promise<boolean> | Observable<boolean> {
    if (userRole === UserRole.admin) {
      return true;
    }
    return requiredRoles.some((role) => {
      return role === userRole;
    });
  }
}
