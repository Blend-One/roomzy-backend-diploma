import { ApiProperty } from '@nestjs/swagger';
import { RoomStatus } from '../models/enums/room-status.enum';
import { RentStatus } from '../models/enums/rent-status.enum';

export class StatusDto {
    @ApiProperty({
        enum: RoomStatus,
        example: RoomStatus.OPENED,
        description: 'Status of the room',
    })
    status: string;
}

export class RentStatusDto {
    @ApiProperty({
        enum: RentStatus,
        example: RentStatus.OPENED,
        description: 'Status of the rent',
    })
    status: string;
}
