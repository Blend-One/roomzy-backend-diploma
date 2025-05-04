import { RoomDto } from './room.api-body';
import { ApiProperty } from '@nestjs/swagger';
import { IdWithNameDto } from './id-with-name.api-body';

class SectionCharAttributeValueDto {
    @ApiProperty({
        type: String,
        example: '3237b5e9-efb2-497c-a759-bee0e4b5d379',
        description: 'The unique identifier for characteristic and attribute relation.',
    })
    id: string;

    @ApiProperty({
        type: IdWithNameDto,
        description: 'The characteristic of the room.',
    })
    characteristic: IdWithNameDto;

    @ApiProperty({
        type: IdWithNameDto,
        description: 'The attribute related to the room characteristic.',
    })
    attribute: IdWithNameDto;
}

class RoomSectionDto {
    @ApiProperty({
        type: Number,
        example: '1',
        description: 'Floor number.',
    })
    floorNumber: number;

    @ApiProperty({
        type: String,
        example: '3237b5e9-efb2-497c-a759-bee0e4b5d379',
        description: 'The unique identifier for section.',
    })
    id: string;

    @ApiProperty({
        type: IdWithNameDto,
        example: {
            id: 'KITCHEN',
            name: 'Ас үй',
        },
        description: 'The section type',
    })
    roomSectionType: IdWithNameDto;

    @ApiProperty({
        type: [SectionCharAttributeValueDto],
        description: 'Characteristics with attribute values',
    })
    sectionAttributeValues: SectionCharAttributeValueDto[];
}

export class RoomWithSectionsDto extends RoomDto {
    @ApiProperty({
        type: String,
        example: null,
        description: 'Physical control instructions for the room (nullable if user is not owner or manager).',
    })
    physControlInstructions: string | null;

    @ApiProperty({
        type: String,
        example: null,
        description: 'Access instructions for the room (nullable if user is not owner or manager).',
    })
    accessInstructions: string | null;

    @ApiProperty({
        type: [RoomSectionDto],
        description: 'Sections of the room',
    })
    roomSections: RoomSectionDto[];
}
