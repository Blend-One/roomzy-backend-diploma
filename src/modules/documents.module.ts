import { Module } from '@nestjs/common';
import DocumentsController from '../controllers/documents.controller';
import DocumentsService from '../services/documents.service';
import { PrismaService } from '../services/prisma.service';
import DocumentsRepository from '../repositories/documents.repository';
import { TokenService } from '../services/token.service';
import { NcaNodeService } from '../services/nca-node.service';
import { TokenRepository } from '../repositories/token.repository';
import { RoomRepository } from '../repositories/room.repository';
import RentRepository from '../repositories/rent.repository';

@Module({
    controllers: [DocumentsController],
    providers: [
        DocumentsService,
        PrismaService,
        RoomRepository,
        RentRepository,
        DocumentsRepository,
        TokenService,
        NcaNodeService,
        TokenRepository,
    ],
})
export default class DocumentsModule {}
