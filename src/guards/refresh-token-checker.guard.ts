import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { TokenService } from '../services/token.service';
import { Observable } from 'rxjs';
import { REFRESH_TOKEN_HEADER } from '../constants/tokens.constants';

@Injectable()
export class RefreshTokenCheckerGuard implements CanActivate {
    constructor(private readonly tokenService: TokenService) {}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        return !!this.tokenService.checkTokenForGuard({
            context,
            headerName: REFRESH_TOKEN_HEADER,
            validationCallback: this.tokenService.validateRefreshToken,
        });
    }
}
