import { Module } from '@nestjs/common';
import { UserController } from 'controllers/user.controller';
import { DatabaseModule } from 'modules/database.module';
import { UserRepository } from 'repositories/user.repository';
import { UserService } from 'services/user.service';
import { AuthService } from '../services/auth.service';
import { TokenService } from '../services/token.service';
import { TokenRepository } from '../repositories/token.repository';

@Module({
    imports: [DatabaseModule],
    controllers: [UserController],
    providers: [UserRepository, UserService, TokenService, AuthService, TokenRepository],
})
export class UserModule {}
