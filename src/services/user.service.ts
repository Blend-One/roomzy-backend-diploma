import { BadRequestException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from 'repositories/user.repository';
import { TokenService } from './token.service';
import { AuthRequestDto } from '../models/requests-schemas/auth.request';
import { AuthService } from './auth.service';
import { AUTH_ERRORS } from '../errors/auth.errors';
import { UserResponseDto } from '../models/dtos/user-response.dto';
import { TokenRepository } from '../repositories/token.repository';
import { REFRESH_TOKEN_HEADER } from '../constants/tokens.constants';

@Injectable()
export class UserService {
    constructor(
        private userRepository: UserRepository,
        private tokenService: TokenService,
        private tokenRepository: TokenRepository,
        private authService: AuthService,
    ) {}

    public async login(authDto: AuthRequestDto): Promise<UserResponseDto> {
        const { email, password } = authDto;
        const user = await this.userRepository.findUserByEmail(email);
        if (!user) throw new BadRequestException(AUTH_ERRORS.USER_NOT_FOUND);
        await this.authService.throwExceptionDueToNotValidPassword(user.password, password);
        return this.tokenService.createTokensForUser(user);
    }

    public async registration(authDto: AuthRequestDto): Promise<UserResponseDto> {
        const { email, password } = authDto;
        const user = await this.userRepository.findUserByEmail(email);
        if (user) throw new BadRequestException(AUTH_ERRORS.USER_ALREADY_EXISTS);
        const encryptedPassword = this.authService.hashPassword(password);
        const createdUser = await this.userRepository.createUser({ email, password: encryptedPassword });
        const tokens = this.tokenService.generateTokens(createdUser);
        await this.tokenRepository.createToken(tokens.refreshToken, createdUser.id);
        return tokens;
    }

    public async refresh(request: Request): Promise<UserResponseDto> {
        const userPayload = request.headers['user'];
        const token = this.tokenService.extractToken(request, REFRESH_TOKEN_HEADER);
        if (!userPayload) throw new UnauthorizedException(AUTH_ERRORS.UNAUTHORIZED);
        const user = await this.userRepository.findUserById(userPayload.id);
        if (!user) throw new UnauthorizedException(AUTH_ERRORS.USER_NOT_FOUND);
        return this.tokenService.refreshTokenForUser(token, user);
    }

    public async logout(request: Request) {
        const token = this.tokenService.extractToken(request, REFRESH_TOKEN_HEADER);
        try {
            await this.tokenRepository.deletesUserTokenByValue(token);
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error: unknown) {
            throw new UnauthorizedException(AUTH_ERRORS.UNAUTHORIZED);
        }
        return { message: HttpStatus.OK };
    }
}
