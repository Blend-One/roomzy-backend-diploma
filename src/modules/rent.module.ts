import { Module } from '@nestjs/common';
import { RentController } from 'controllers/rent.controller';
import RentService from '../services/rent.service';
import { TokenService } from '../services/token.service';
import { TokenRepository } from '../repositories/token.repository';
import { PrismaService } from '../services/prisma.service';
import { RoomRepository } from '../repositories/room.repository';
import RentRepository from '../repositories/rent.repository';
import { ControversialIssuesController } from '../controllers/controversial_issues.controller';
import MailModule from './mail.module';

@Module({
    imports: [MailModule],
    controllers: [RentController, ControversialIssuesController],
    providers: [RentService, TokenService, TokenRepository, PrismaService, RoomRepository, RentRepository],
})
export default class RentModule {}
