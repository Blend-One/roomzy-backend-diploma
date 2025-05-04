import { ApiProperty } from '@nestjs/swagger';
import { BasicRoomDto } from './basic-room.api-body';
import { IdWithNameDto } from './id-with-name.api-body';
import { RoomImageDto } from './room-image.api-body';

export class AdResponse extends BasicRoomDto {
    @ApiProperty({
        type: String,
        example: '93203baa-fc7d-4c0e-ab3c-5f2269d2f181',
        description: 'Unique identifier for the room.',
    })
    id: string;

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
        example: '2ed078a9-b6ab-4d1a-bf7d-33d93ae19830',
        description: 'Unique identifier of the user who owns the room.',
    })
    userId: string;

    @ApiProperty({
        type: String,
        example: 'APARTMENT',
        description: 'The type of the room.',
    })
    roomTypeId: string;

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
}

export class RoomResponseDto {
    @ApiProperty({
        type: AdResponse,
    })
    ad: AdResponse;

    @ApiProperty({
        type: [RoomImageDto],
        example: [
            {
                id: '9151d764-64c9-4f0c-8b82-316783b71014',
                roomId: '93203baa-fc7d-4c0e-ab3c-5f2269d2f181',
                hash: null,
                name: 'ab45c31e90d378556dc76267e583c4a7.png',
            },
        ],
        description: 'List of images associated with the room.',
    })
    imageRecords: IdWithNameDto[];
}
