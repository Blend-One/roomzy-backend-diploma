import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { UserStatus } from 'models/enums/user-status.enum';
import { AUTH_ERRORS } from 'errors/auth.errors';
import { Role } from '../models/enums/role.enum';

export const getStatusCheckerGuard = (roles: Role[], status: UserStatus) => {
    @Injectable()
    class UserStatusCheckerGuard implements CanActivate {
        canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
            const user = context.switchToHttp().getRequest<Request>().headers['user'];
            const userStatus = user?.['status'];
            const userRole = user?.['role'];
            if (status !== userStatus || !roles.includes(userRole)) throw new ForbiddenException(AUTH_ERRORS.FORBIDDEN);
            return true;
        }
    }

    return UserStatusCheckerGuard;
};
