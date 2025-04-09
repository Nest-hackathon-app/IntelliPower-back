import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ExtendedRequest } from '../interfaces/extended.req';
import { Reflector } from '@nestjs/core';
import { rolesKey } from '../decorators/userRole.decorator';
import { UserRole } from '@prisma/client';

export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest<ExtendedRequest>();
    const userRole = req.user.role;
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      rolesKey,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredRoles) {
      return true;
    }
    return this.matchRoles(userRole, requiredRoles);
  }
  matchRoles(
    userRole: string,
    requiredRoles: UserRole[],
  ): boolean | Promise<boolean> | Observable<boolean> {
    if (userRole === UserRole.ADMIN) {
      return true;
    }
    return requiredRoles.some((role) => {
      return role === userRole;
    });
  }
}
