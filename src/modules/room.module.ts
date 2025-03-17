import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { RoomController } from 'controllers/room.controller';
import S3Module from './s3.module';
import { TokenService } from '../services/token.service';
import { TokenRepository } from '../repositories/token.repository';
import { PrismaService } from '../services/prisma.service';
import { RoomService } from '../services/room.service';
import { RoomRepository } from '../repositories/room.repository';
import { CommonRepository } from '../repositories/common.repository';
import { ImageRepository } from '../repositories/image.repository';
import { SectionsRepository } from '../repositories/sections.repository';
import { SharpService } from '../services/sharp.service';
import { ExtractUserInfoMiddleware } from '../middleware/extract-user-info.middleware';
import { ROOM_ROUTES } from '../routes/room.routes';

@Module({
    imports: [S3Module],
    controllers: [RoomController],
    providers: [
        TokenService,
        TokenRepository,
        PrismaService,
        RoomService,
        RoomRepository,
        CommonRepository,
        ImageRepository,
        SectionsRepository,
        SharpService,
    ],
})
export default class RoomModule implements NestModule {
    configure(consumer: MiddlewareConsumer): any {
        consumer.apply(ExtractUserInfoMiddleware).forRoutes({
            path: `${ROOM_ROUTES.DEFAULT}/${ROOM_ROUTES.GET_AD}`,
            method: RequestMethod.GET,
        });
    }
}
