import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { UserStatus } from 'models/enums/user-status.enum';
import { AUTH_ERRORS } from 'errors/auth.errors';

export const getStatusCheckerGuard = (status: UserStatus) => {
    @Injectable()
    class UserStatusCheckerGuard implements CanActivate {
        canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
            const requestStatus = context.switchToHttp().getRequest<Request>().headers['user']?.['status'];
            if (status !== requestStatus) throw new ForbiddenException(AUTH_ERRORS.FORBIDDEN);
            return true;
        }
    }

    return UserStatusCheckerGuard;
};
