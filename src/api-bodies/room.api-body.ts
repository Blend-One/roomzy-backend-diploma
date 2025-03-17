import { ApiProperty } from '@nestjs/swagger';
import { BasicRoomDto } from './basic-room.api-body';
import { IdWithNameDto } from './id-with-name.api-body';
import { RoomImageDto } from './room-image.api-body';

export class RoomDto extends BasicRoomDto {
    @ApiProperty({
        type: String,
        example: '93203baa-fc7d-4c0e-ab3c-5f2269d2f181',
        description: 'Unique identifier for the room.',
    })
    id: string;

    @ApiProperty({
        type: String,
        example: '2ed078a9-b6ab-4d1a-bf7d-33d93ae19830',
        description: 'Unique identifier of the user who owns the room.',
    })
    userId: string;

    @ApiProperty({
        type: String,
        example: 'OPENED',
        description: 'Status of the room.',
    })
    status: string;

    @ApiProperty({
        type: Boolean,
        example: false,
        description: 'Whether physical control is required for the room.',
    })
    physControl: boolean;

    @ApiProperty({
        type: IdWithNameDto,
        example: {
            id: 'APARTMENT',
            name: 'Пәтер',
        },
        description: 'Room type information.',
    })
    roomType: IdWithNameDto;

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
    roomImages: IdWithNameDto[];

    @ApiProperty({
        type: IdWithNameDto,
        example: {
            id: 'ALMATY_ALMALINSKY',
            name: 'Алмалы',
        },
        description: 'District information for the room.',
    })
    district: IdWithNameDto;

    @ApiProperty({
        type: IdWithNameDto,
        example: {
            id: 'ALMATY',
            name: 'Алматы',
        },
        description: 'City information for the room.',
    })
    city: IdWithNameDto;
}
