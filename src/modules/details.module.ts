import { Module } from '@nestjs/common';
import { PrismaService } from 'services/prisma.service';
import { TokenService } from 'services/token.service';
import { DetailsRepository } from 'repositories/details.repository';
import { TokenRepository } from 'repositories/token.repository';
import { AttributesController } from 'controllers/attributes.controller';
import { AttributeService } from 'services/attribute.service';
import { CharacteristicsController } from 'controllers/characteristics.controller';
import { CharacteristicsService } from 'services/characteristics.service';
import { CommonRepository } from 'repositories/common.repository';
import { SectionTypesController } from 'controllers/section-types.controller';
import { SectionTypesService } from 'services/section-types.service';
import { DetailsService } from 'services/details.service';
import { RoomTypesService } from 'services/room-types.service';
import { CharacteristicsRepository } from 'repositories/characteristics.repository';
import { RoomTypesController } from 'controllers/room-types.controller';
import { RoomTypesRepository } from 'repositories/room-types.repository';
import { DictController } from 'controllers/dict.controller';
import { DictRepository } from 'repositories/dict.repository';
import { DictService } from 'services/dict.service';

@Module({
    imports: [],
    controllers: [
        DictController,
        AttributesController,
        CharacteristicsController,
        SectionTypesController,
        RoomTypesController,
    ],
    providers: [
        PrismaService,
        TokenService,
        DictRepository,
        SectionTypesService,
        DetailsRepository,
        AttributeService,
        TokenRepository,
        CharacteristicsService,
        CommonRepository,
        DetailsService,
        RoomTypesService,
        CharacteristicsRepository,
        RoomTypesService,
        RoomTypesRepository,
        DictService,
    ],
})
export default class DetailsModule {}
