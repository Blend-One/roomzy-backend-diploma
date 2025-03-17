import { ApiProperty } from '@nestjs/swagger';

export class CreateSectionRoomDto {
    @ApiProperty({
        type: Number,
        example: 1,
        description: 'The floor number where the room is located.',
    })
    floorNumber: number;

    @ApiProperty({
        type: String,
        example: 'A1',
        description: 'The type of room section.',
    })
    roomSectionTypeId: string;

    @ApiProperty({
        type: Object,
        example: { key: 'value' },
        description: 'Additional attributes for the room section.',
    })
    sectionAttributeValues: Record<string, any>;
}
