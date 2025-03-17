import { ApiProperty } from '@nestjs/swagger';
import { CreateSectionRoomDto } from './section-room.api-body';
import { BasicRoomOptionalDto } from './basic-room-optional.api-body'; // Import your original DTO

export class UpdateRoomDto extends BasicRoomOptionalDto {
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
        required: false,
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
        required: false,
    })
    cityId: string;

    @ApiProperty({
        type: String,
        example: 'ASTANA_SARYARKA',
        description: 'The ID of the district where the room is located.',
        required: false,
    })
    districtId: string;

    @ApiProperty({
        type: [String],
        example: ['93203baa-fc7d-4c0e-ab3c-5f2269d2f181', '42203baa-fc7d-4c0e-ab3c-4342541'],
        required: false,
        description: 'List of section which should be deleted',
    })
    sectionsToDelete: string[];

    @ApiProperty({
        type: [CreateSectionRoomDto],
        example: [
            {
                floorNumber: 1,
                id: '93203baa-fc7d-4c0e-ab3c-5f2269d2f181',
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
            'For sectionAttributeValues it is required to pass ids of characteristics as keys and ids of attributes as values within object. ' +
            'For updating specific section, required to provide id of the section. ' +
            'IMPORTANT!!!! If needed to create new section, id: "FOR_CREATION" should be provided instead of actual section id',
    })
    sections: string;
}
