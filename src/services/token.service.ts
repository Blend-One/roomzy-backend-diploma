import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Token, User } from '@prisma/client';
import { UserResponseDto } from 'models/dtos/user-response.dto';
import { UserTokenPayloadDto } from 'models/dtos/user-token-payload.dto';
import { TokenRepository } from 'repositories/token.repository';
import { AUTH_ERRORS } from 'errors/auth.errors';

@Injectable()
export class TokenService {
    constructor(
        private jwt: JwtService,
        private tokenRepository: TokenRepository,
    ) {}

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

    public extractToken(request: Request, headerName: string) {
        return request.headers[headerName]?.split(' ')[1];
    }

    public async refreshTokenForUser(refreshToken: string, user: User) {
        const tokens = this.generateTokens(user);
        try {
            await this.tokenRepository.updateRefreshToken(refreshToken, tokens.refreshToken);
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error: unknown) {
            throw new UnauthorizedException(AUTH_ERRORS.UNAUTHORIZED);
        }
        return tokens;
    }

    public async createTokensForUser(user: User) {
        const userWithTokens = await this.tokenRepository.getUserTokens(user.id);
        const tokens = this.generateTokens(user);
        await Promise.all([
            this.removeOldTokens(userWithTokens),
            this.tokenRepository.createToken(tokens.refreshToken, user.id),
        ]);
        return tokens;
    }

    public async removeOldTokens(tokens: Token[]) {
        const tokensToRemove = [];
        const LIMIT = +process.env.MAX_SESSIONS || 5;
        if (tokens.length < LIMIT) return;
        for (let i = tokens.length; i >= LIMIT; i--) {
            tokensToRemove.push(tokens.shift().id);
        }
        await this.tokenRepository.deleteUserTokensById(tokensToRemove);
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
        const token = this.extractToken(request, headerName.toLowerCase()) as string;
        const result = validationCallback(token);

        request.headers['user'] = result;

        if ((result as { message: string })?.message) {
            request.headers['user'] = null;
            if (!shouldSkipCondition) throw new UnauthorizedException(JSON.stringify(result));
        }

        return result;
    }
}
