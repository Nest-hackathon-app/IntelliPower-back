import { SetMetadata } from '@nestjs/common';
import { UserRole} from '@prisma/client';

export const rolesKey = 'Roles';
export const Roles = (...roles: UserRole[]) => SetMetadata(rolesKey, roles);
