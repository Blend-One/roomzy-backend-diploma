import { Module } from '@nestjs/common';
import { RoomController } from 'controllers/room.controller';
import S3Module from './s3.module';
import { TokenService } from '../services/token.service';
import { TokenRepository } from '../repositories/token.repository';
import { PrismaService } from '../services/prisma.service';
import { RoomService } from '../services/room.service';
import { RoomRepository } from '../repositories/room.repository';

@Module({
    imports: [S3Module],
    controllers: [RoomController],
    providers: [TokenService, TokenRepository, PrismaService, RoomService, RoomRepository],
})
export default class RoomModule {}
