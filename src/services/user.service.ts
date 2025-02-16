import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from 'repositories/user.repository';
import { TokenService } from './token.service';
import { AuthRequestDto } from '../models/requests-schemas/auth.request';
import { AuthService } from './auth.service';
import { AUTH_ERRORS } from '../errors/auth.errors';
import { UserResponseDto } from '../models/dtos/user-response.dto';

@Injectable()
export class UserService {
    constructor(
        private userRepository: UserRepository,
        private tokenService: TokenService,
        private authService: AuthService,
    ) {}

    public async login(authDto: AuthRequestDto): Promise<UserResponseDto> {
        const { email, password } = authDto;
        const user = await this.userRepository.findUserByEmail(email);
        if (!user) throw new BadRequestException(AUTH_ERRORS.USER_NOT_FOUND);
        await this.authService.throwExceptionDueToNotValidPassword(user.password, password);
        return this.tokenService.generateTokens(user);
    }

    public async registration(authDto: AuthRequestDto): Promise<UserResponseDto> {
        const { email, password } = authDto;
        const user = await this.userRepository.findUserByEmail(email);
        if (user) throw new BadRequestException(AUTH_ERRORS.USER_ALREADY_EXISTS);
        const encryptedPassword = this.authService.hashPassword(password);
        const createdUser = await this.userRepository.createUser({ email, password: encryptedPassword });
        return this.tokenService.generateTokens(createdUser);
    }

    public async refresh(request: Request): Promise<UserResponseDto> {
        const userPayload = request.headers['user'];
        if (!userPayload) throw new UnauthorizedException(AUTH_ERRORS.UNAUTHORIZED);
        const verifiedData = this.tokenService.validateRefreshToken(userPayload);
        const user = await this.userRepository.findUserById(verifiedData.id);
        if (!user) throw new UnauthorizedException(AUTH_ERRORS.USER_NOT_FOUND);
        return this.tokenService.generateTokens(user);
    }

    public async logout() {}
}
