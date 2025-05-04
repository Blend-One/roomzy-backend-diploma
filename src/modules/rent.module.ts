import { Module } from '@nestjs/common';
import { RentController } from 'controllers/rent.controller';
import RentService from '../services/rent.service';
import { TokenService } from '../services/token.service';
import { TokenRepository } from '../repositories/token.repository';
import { PrismaService } from '../services/prisma.service';
import { RoomRepository } from '../repositories/room.repository';
import RentRepository from '../repositories/rent.repository';
import { ControversialIssuesController } from '../controllers/controversial-issues.controller';
import MailModule from './mail.module';
import PaymentModule from '../payment/payment.module';
import { ControversialIssuesService } from '../services/controversial-issues.service';
import { ControversialIssuesRepository } from '../repositories/controversial-issues.repository';
import S3Module from './s3.module';
import { CommonRepository } from '../repositories/common.repository';
import { SharpService } from '../services/sharp.service';
import DocumentsRepository from '../repositories/documents.repository';
import DocumentsService from '../services/documents.service';
import { NcaNodeService } from '../services/nca-node.service';

@Module({
    imports: [MailModule, PaymentModule, S3Module],
    controllers: [RentController, ControversialIssuesController],
    providers: [
        RentService,
        DocumentsRepository,
        TokenService,
        TokenRepository,
        SharpService,
        PrismaService,
        RoomRepository,
        CommonRepository,
        RentRepository,
        DocumentsService,
        NcaNodeService,
        ControversialIssuesService,
        ControversialIssuesRepository,
    ],
})
export default class RentModule {}
