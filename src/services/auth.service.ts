import { BadRequestException, Injectable } from '@nestjs/common';
import { compareSync, hashSync } from 'bcrypt';
import { AUTH_ERRORS } from '../errors/auth.errors';
import { UserRepository } from '../repositories/user.repository';

@Injectable()
export class AuthService {
    private SALT = 5;

    constructor(private userRepository: UserRepository) {}

    public async throwExceptionDueToNotValidPassword(hash: string, password: string): Promise<void> {
        const areEqual = compareSync(password, hash);
        if (!areEqual) throw new BadRequestException(AUTH_ERRORS.PASSWORDS_ARE_NOT_EQUAL);
    }

    public hashPassword(password: string) {
        return hashSync(password, this.SALT);
    }
}
