import { Injectable, NestMiddleware } from '@nestjs/common';
import { TokenService } from '../services/token.service';
import { AUTHORIZATION_HEADER } from '../constants/tokens.constants';

@Injectable()
export class ExtractUserInfoMiddleware implements NestMiddleware {
    constructor(private readonly tokenService: TokenService) {}

    use(req: Request, res: any, next: (error?: any) => void): any {
        this.tokenService.checkTokenForGuard({
            req,
            headerName: AUTHORIZATION_HEADER,
            shouldSkipCondition: true,
            validationCallback: this.tokenService.validateAccessToken,
        });

        next();
    }
}
