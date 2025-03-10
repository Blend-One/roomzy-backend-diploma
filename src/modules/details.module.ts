import { Module } from '@nestjs/common';
import { PrismaService } from '../services/prisma.service';
import { TokenService } from '../services/token.service';
import { DetailsRepository } from '../repositories/details.repository';
import { TokenRepository } from '../repositories/token.repository';
import { AttributesController } from '../controllers/attributes.controller';
import { AttributeService } from '../services/attribute.service';

@Module({
    imports: [],
    controllers: [AttributesController],
    providers: [PrismaService, TokenService, DetailsRepository, AttributeService, TokenRepository],
})
export default class DetailsModule {}
