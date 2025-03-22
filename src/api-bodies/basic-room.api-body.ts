import { ApiProperty } from '@nestjs/swagger';

export class BasicRoomDto {
    @ApiProperty({
        type: String,
        example: 'Title123',
        description: 'Title of the room.',
    })
    title: string;

    @ApiProperty({
        type: String,
        example: '434',
        description: 'Price of the room.',
    })
    price: string;

    @ApiProperty({
        type: String,
        example: 'PER_DAY',
        description: 'Unit of the price for the room.',
    })
    priceUnit: string;

    @ApiProperty({
        type: String,
        example: null,
        description: 'Physical control instructions for the room (nullable).',
    })
    physControlInstructions: string | null;

    @ApiProperty({
        type: String,
        example: null,
        description: 'Access instructions for the room (nullable).',
    })
    accessInstructions: string | null;

    @ApiProperty({
        type: String,
        example: 'someStreet',
        required: false,
        description: 'Street address of the room.',
    })
    street: string;

    @ApiProperty({
        type: String,
        example: 12,
        description: 'Building of the room.',
    })
    building: string;

    @ApiProperty({
        type: String,
        example: '54',
        required: false,
        description: 'Apartment number of the room.',
    })
    appartment: string;

    @ApiProperty({
        type: Boolean,
        example: true,
        description: 'Whether the room is commercial.',
    })
    isCommercial: boolean;

    @ApiProperty({
        type: Boolean,
        example: true,
        description: 'Whether the room has a deposit.',
    })
    hasDeposit: boolean;

    @ApiProperty({
        type: Number,
        example: 323,
        description: 'Square footage of the room.',
    })
    square: number;

    @ApiProperty({
        type: Number,
        example: 32,
        description: 'Latitude coordinate of the room.',
    })
    lat: number;

    @ApiProperty({
        type: Number,
        example: 23,
        description: 'Longitude coordinate of the room.',
    })
    lon: number;
}
