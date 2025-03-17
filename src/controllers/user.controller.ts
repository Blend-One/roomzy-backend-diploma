import { Body, Controller, Get, Post, UseGuards, Request, UsePipes } from '@nestjs/common';
import { USER_ROUTES } from 'routes/user.routes';
import { UserService } from 'services/user.service';
import { ZodValidationPipe } from '../pipes/zod-validation.pipe';
import { AuthRequestDto, AuthSchema } from '../models/requests-schemas/auth.request';
import { RefreshTokenCheckerGuard } from '../guards/refresh-token-checker.guard';
import { API_TAGS } from '../constants/api-tags.constants';
import { ApiBody, ApiHeader, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthUserDto } from '../api-bodies/user-auth.api-body';
import { REFRESH_TOKEN_HEADER } from '../constants/tokens.constants';

@ApiTags(API_TAGS.USERS)
@Controller({ path: USER_ROUTES.DEFAULT })
export class UserController {
    constructor(private userService: UserService) {}

    @ApiOperation({ summary: 'Logging in with the user' })
    @ApiBody({ type: AuthUserDto })
    @UsePipes(new ZodValidationPipe(AuthSchema))
    @Post(USER_ROUTES.LOGIN)
    public async login(@Body() authDto: AuthRequestDto) {
        return this.userService.login(authDto);
    }

    @ApiOperation({ summary: 'Registration of the user' })
    @ApiBody({ type: AuthUserDto })
    @UsePipes(new ZodValidationPipe(AuthSchema))
    @Post(USER_ROUTES.REGISTRATION)
    public async registration(@Body() authDto: AuthRequestDto) {
        return this.userService.registration(authDto);
    }

    @ApiOperation({ summary: 'Refresh of an authentication token' })
    @ApiHeader({
        name: REFRESH_TOKEN_HEADER,
        description: 'Refresh token for bearer token re-generation',
        required: true,
    })
    @UseGuards(RefreshTokenCheckerGuard)
    @Get(USER_ROUTES.REFRESH)
    public async refresh(@Request() request: Request) {
        return this.userService.refresh(request);
    }

    @ApiOperation({ summary: 'Logging out with the user' })
    @ApiHeader({
        name: REFRESH_TOKEN_HEADER,
        description: 'Refresh token for bearer token re-generation',
        required: true,
    })
    @Post(USER_ROUTES.LOGOUT)
    public async logout(@Request() request: Request) {
        return this.userService.logout(request);
    }
}
