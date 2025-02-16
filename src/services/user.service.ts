import { Injectable } from '@nestjs/common';
import { UserRepository } from 'repositories/user.repository';
import { TokenService } from './token.service';

@Injectable()
export class UserService {
    constructor(
        private userRepository: UserRepository,
        private tokenService: TokenService,
    ) {}

    public async login() {}

    public async registration() {}

    public async refresh() {}

    public async logout() {}
}
