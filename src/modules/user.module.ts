import { Module } from '@nestjs/common';
import { UserController } from 'controllers/user.controller';
import { DatabaseModule } from 'modules/database.module';
import { UserRepository } from 'repositories/user.repository';
import { UserService } from 'services/user.service';

@Module({
    imports: [DatabaseModule],
    controllers: [UserController],
    providers: [UserRepository, UserService],
})
export class UserModule {}
