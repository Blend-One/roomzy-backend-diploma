import { CreateDetailsDto, PatchDetailsDto } from './create-details.api-body';
import { ApiProperty } from '@nestjs/swagger';
import { IdWithNameDto } from './id-with-name.api-body';

export class CreateRoomTypeDetailsDto extends CreateDetailsDto {
    @ApiProperty({
        type: [String],
        example: ['e84b734c-2105-46ca-805e-93a9a2e6bac1', 'gfw3734c-2105-46ca-805e-93a9afde45y6'],
        description: 'Ids of section types which should be related with roomType',
    })
    sectionIds: string[];
}

export class PatchRoomTypeDetailsDto extends PatchDetailsDto {
    @ApiProperty({
        required: false,
        type: [String],
        example: ['e84b734c-2105-46ca-805e-93a9a2e6bac1', 'gfw3734c-2105-46ca-805e-93a9afde45y6'],
        description: 'Ids of section types which should be related with roomType',
    })
    sectionIds: string[];
}

export class RoomTypeWithSectionTypesDto extends IdWithNameDto {
    @ApiProperty({
        type: [IdWithNameDto],
        example: [
            {
                id: 'BEDROOM',
                name: 'Ұйықтайтын бөлме',
            },
            {
                id: 'LIVING_ROOM',
                name: 'Қонақ бөлмесі',
            },
        ],
        description: 'Array of section types',
    })
    sectionTypes: IdWithNameDto[];
}
