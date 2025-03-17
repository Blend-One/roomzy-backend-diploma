import { Module } from '@nestjs/common';
import { ImageController } from '../controllers/image.controller';
import S3Module from './s3.module';
import { TokenService } from '../services/token.service';
import { TokenRepository } from '../repositories/token.repository';
import { PrismaService } from '../services/prisma.service';

@Module({
    imports: [S3Module],
    controllers: [ImageController],
    providers: [TokenService, TokenRepository, PrismaService],
})
export default class ImageModule {}
