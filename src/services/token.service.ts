import { ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { UserResponseDto } from '../models/dtos/user-response.dto';

@Injectable()
export class TokenService {
    constructor(private jwt: JwtService) {}

    public generateTokens(userPayload: Omit<User, 'password'>): UserResponseDto {
        const issTimeOfRefreshToken = process.env.REFRESH_EXPIRES_IN || '15d';

        const accessToken = this.jwt.sign(userPayload);
        const refreshToken = this.jwt.sign(userPayload, {
            expiresIn: issTimeOfRefreshToken,
            secret: process.env.REFRESH_SECRET,
        });

        return { accessToken, refreshToken };
    }

    public validateRefreshToken(refreshToken?: string): boolean {
        try {
            return !!this.jwt.verify(refreshToken, { secret: process.env.REFRESH_SECRET });
        } catch (error: unknown) {
            return !!error;
        }
    }

    public validateAccessToken(accessToken?: string) {
        try {
            return !!this.jwt.verify(accessToken, { secret: process.env.ACCESS_SECRET });
        } catch (error: unknown) {
            return !!error;
        }
    }

    public checkTokenForGuard({
        context,
        headerName,
        validationCallback,
    }: {
        context: ExecutionContext;
        headerName: string;
        validationCallback: (token?: string) => boolean;
    }) {
        const request = context.switchToHttp().getRequest<Request>();

        const accessToken = request.headers[headerName].split(' ')[1] as string;

        return validationCallback(accessToken);
    }
}
