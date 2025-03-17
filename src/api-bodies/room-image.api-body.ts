import { ApiProperty } from '@nestjs/swagger';

export class RoomImageDto {
    @ApiProperty({
        type: String,
        example: '9151d764-64c9-4f0c-8b82-316783b71014',
        description: 'Unique identifier for the room image.',
    })
    id: string;

    @ApiProperty({
        type: String,
        example: '93203baa-fc7d-4c0e-ab3c-5f2269d2f181',
        description: 'The unique ID of the room associated with this image.',
    })
    roomId: string;

    @ApiProperty({
        type: String,
        example: null,
        description: 'The hash value of the image (nullable).',
    })
    hash: string | null;

    @ApiProperty({
        type: String,
        example: 'ab45c31e90d378556dc76267e583c4a7.png',
        description: 'The name of the image file.',
    })
    name: string;
}
