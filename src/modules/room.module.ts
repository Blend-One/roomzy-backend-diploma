import { Module } from '@nestjs/common';
import { RoomController } from 'controllers/room.controller';
import S3Module from './s3.module';

@Module({
    imports: [S3Module],
    controllers: [RoomController],
    providers: [],
})
export default class RoomModule {}
