import { ApiProperty } from '@nestjs/swagger';
import { RangeDto } from './range.api-body';
import { PriceUnit } from '../models/enums/price-unit.enum';
import { CreateSectionRoomDto } from './section-room.api-body';

export class FiltersDocsDto {
    @ApiProperty({
        type: String,
        example: 'Room Title',
        required: false,
        description: 'The title of the room.',
    })
    title: string;

    @ApiProperty({
        type: RangeDto,
        required: false,
        example: {
            min: 0,
            max: 1000,
        },
        description: 'The price range filter for the room.',
    })
    priceRange: RangeDto;

    @ApiProperty({
        enum: PriceUnit,
        required: false,
        example: PriceUnit.PER_MONTH,
        description: 'The price unit of the room.',
    })
    priceUnit: PriceUnit;

    @ApiProperty({
        type: Boolean,
        required: false,
        example: true,
        description: 'Whether the room has physical control or not.',
    })
    physControl: boolean;

    @ApiProperty({
        type: Boolean,
        required: false,
        example: false,
        description: 'Whether access instructions are available for the room.',
    })
    accessInstructions: boolean;

    @ApiProperty({
        type: [String],
        required: false,
        example: ['ALMATY_ALMALINSKY', 'ALMATY_AUEZOVSKY'],
        description: 'List of district IDs for filtering.',
    })
    districtIds: string[];

    @ApiProperty({
        type: String,
        required: false,
        example: 'ALMATY',
        description: 'The ID of the city.',
    })
    cityId: string;

    @ApiProperty({
        type: Boolean,
        required: false,
        example: true,
        description: 'Whether the room is commercial.',
    })
    isCommercial: boolean;

    @ApiProperty({
        type: RangeDto,
        required: false,
        example: {
            min: 0,
            max: 1000,
        },
        description: 'The square range filter for the room.',
    })
    square: RangeDto;

    @ApiProperty({
        type: String,
        required: false,
        example: 'APARTMENT',
        description: 'The room type ID for filtering.',
    })
    roomTypeId: string;

    @ApiProperty({
        required: false,
        type: [CreateSectionRoomDto],
        description: 'List of section values for the room.',
    })
    sections: CreateSectionRoomDto[];

    @ApiProperty({
        type: Boolean,
        required: false,
        example: false,
        description: 'Whether the room has a deposit or not.',
    })
    hasDeposit: boolean;
}
