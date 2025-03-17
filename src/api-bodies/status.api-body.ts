import { ApiProperty } from '@nestjs/swagger';
import { RoomStatus } from '../models/enums/room-status.enum';

export class StatusDto {
    @ApiProperty({
        enum: RoomStatus,
        example: RoomStatus.OPENED,
        description: 'Status of the room',
    })
    status: string;
}
