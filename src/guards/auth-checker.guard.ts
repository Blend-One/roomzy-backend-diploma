import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { TokenService } from '../services/token.service';
import { Observable } from 'rxjs';

@Injectable()
export class AuthCheckerGuard implements CanActivate {
    constructor(private readonly tokenService: TokenService) {}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        return !!this.tokenService.checkTokenForGuard({
            context,
            headerName: 'Authorization',
            validationCallback: this.tokenService.validateAccessToken,
        });
    }
}
