import { CreateDetailsDto, PatchDetailsDto } from './create-details.api-body';
import { ApiProperty } from '@nestjs/swagger';
import { IdWithNameDto } from './id-with-name.api-body';

export class CreateSectionTypeDetailsDto extends CreateDetailsDto {
    @ApiProperty({
        type: [String],
        example: ['e84b734c-2105-46ca-805e-93a9a2e6bac1', 'gfw3734c-2105-46ca-805e-93a9afde45y6'],
        description: 'Ids of characteristics which should be related with sectionType',
    })
    characteristicIds: string[];
}

export class PatchSectionTypeDetailsDto extends PatchDetailsDto {
    @ApiProperty({
        required: false,
        type: [String],
        example: ['e84b734c-2105-46ca-805e-93a9a2e6bac1', 'gfw3734c-2105-46ca-805e-93a9afde45y6'],
        description: 'Ids of characteristics which should be related with sectionType',
    })
    characteristicIds: string[];
}

export class SectionTypeWithCharsDto extends IdWithNameDto {
    @ApiProperty({
        type: [IdWithNameDto],
        example: [
            {
                id: 'ROOM_SIZE',
                name: 'Бөлменің өлшемі',
            },
            {
                id: 'CEILING_HEIGHT',
                name: 'Төбе биіктігі',
            },
        ],
        description: 'Array of characteristics',
    })
    characteristics: IdWithNameDto[];
}
