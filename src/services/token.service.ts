import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { UserResponseDto } from '../models/dtos/user-response.dto';
import { UserTokenPayloadDto } from '../models/dtos/user-token-payload.dto';

@Injectable()
export class TokenService {
    constructor(private jwt: JwtService) {}

    public generateTokens(userPayload: User): UserResponseDto {
        const tokenPayload = new UserTokenPayloadDto(userPayload).build();
        const issTimeOfRefreshToken = process.env.REFRESH_EXPIRES_IN || '15d';

        const accessToken = this.jwt.sign(tokenPayload);
        const refreshToken = this.jwt.sign(tokenPayload, {
            expiresIn: issTimeOfRefreshToken,
            secret: process.env.REFRESH_SECRET,
        });

        return { accessToken, refreshToken };
    }

    public validateRefreshToken = (refreshToken?: string) => {
        try {
            return this.jwt.verify(refreshToken, { secret: process.env.REFRESH_SECRET });
        } catch (error: unknown) {
            return error;
        }
    };

    public validateAccessToken = (accessToken?: string) => {
        try {
            return this.jwt.verify(accessToken, { secret: process.env.ACCESS_SECRET });
        } catch (error: unknown) {
            return error;
        }
    };

    public checkTokenForGuard({
        context,
        headerName,
        validationCallback,
        shouldSkipCondition,
    }: {
        context: ExecutionContext;
        headerName: string;
        validationCallback: (token?: string) => unknown;
        shouldSkipCondition?: boolean;
    }) {
        const request = context.switchToHttp().getRequest<Request>();
        const accessToken = request.headers[headerName]?.split(' ')[1] as string;
        const result = validationCallback(accessToken);

        request.headers['user'] = result;

        if ((result as { message: string })?.message) {
            request.headers['user'] = null;
            if (!shouldSkipCondition) throw new UnauthorizedException(JSON.stringify(result));
        }

        return result;
    }
}
