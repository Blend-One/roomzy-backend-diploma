import { Controller, Get, Post, UseGuards, UsePipes } from '@nestjs/common';
import { USER_ROUTES } from 'routes/user.routes';
import { UserService } from 'services/user.service';
import { ZodValidationPipe } from '../pipes/zod-validation.pipe';
import { AuthSchema } from '../models/requests-schemas/auth.request';
import { AuthCheckerGuard } from '../guards/auth-checker.guard';
import { RefreshTokenCheckerGuard } from '../guards/refresh-token-checker.guard';

@Controller({ path: USER_ROUTES.DEFAULT })
export class UserController {
    constructor(private userService: UserService) {}

    @UsePipes(new ZodValidationPipe(AuthSchema))
    @Post(USER_ROUTES.LOGIN)
    public async login() {}

    @UsePipes(new ZodValidationPipe(AuthSchema))
    @Post(USER_ROUTES.REGISTRATION)
    public async registration() {}

    @UseGuards(RefreshTokenCheckerGuard)
    @Get(USER_ROUTES.REFRESH)
    public async refresh() {}

    @UseGuards(AuthCheckerGuard)
    @Get(USER_ROUTES.LOGOUT)
    public async logout() {}
}
