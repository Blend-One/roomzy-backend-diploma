import { Controller, Get } from '@nestjs/common';
import { USER_ROUTES } from 'routes/user.routes';
import { UserService } from 'services/user.service';

@Controller({ path: USER_ROUTES.DEFAULT })
export class UserController {
    constructor(private userService: UserService) {}

    @Get(USER_ROUTES.LOGIN)
    public async login() {
        return this.userService.getUserCount();
    }
}
