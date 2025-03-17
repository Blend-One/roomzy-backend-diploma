import { ApiProperty } from '@nestjs/swagger';
import { BasicRoomDto } from './basic-room.api-body';
import { CreateSectionRoomDto } from './section-room.api-body';

export class CreateRoomDto extends BasicRoomDto {
    @ApiProperty({
        type: 'array',
        items: {
            type: 'string',
            maxItems: 10,
            format: 'binary',
        },
        required: false,
    })
    files: Express.Multer.File;

    @ApiProperty({
        type: String,
        example: 'APARTMENT',
        description: 'The type of the room.',
    })
    roomTypeId: string;

    @ApiProperty({
        type: String,
        example: 'Please follow the guidelines for physical control.',
        required: false,
        description: 'Instructions for physical control (optional).',
    })
    physControlInstructions: string;

    @ApiProperty({
        type: String,
        example: 'Room is accessible via back entrance.',
        required: false,
        description: 'Instructions for accessing the room (optional).',
    })
    accessInstructions: string;

    @ApiProperty({
        type: String,
        example: 'ASTANA',
        description: 'The ID of the city where the room is located.',
    })
    cityId: string;

    @ApiProperty({
        type: String,
        example: 'ASTANA_SARYARKA',
        description: 'The ID of the district where the room is located.',
    })
    districtId: string;

    @ApiProperty({
        type: [CreateSectionRoomDto],
        example: [
            {
                floorNumber: 1,
                roomSectionTypeId: 'BEDROOM',
                sectionAttributeValues: {
                    FLOORING_TYPE: 'TILE',
                    ROOM_SIZE: 'SIZE_15',
                    WINDOWS_TYPE: 'TRIPLE',
                },
            },
        ],
        required: false,
        description:
            'List of sections assigned to the room (optional). Sections should be passed as string value due to multipart content type (use JSON stringify to convert). ' +
            'For sectionAttributeValues it is required to pass ids of characteristics as keys and ids of attributes as values within object',
    })
    sections?: string;
}
