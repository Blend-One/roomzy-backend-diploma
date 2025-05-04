import { ApiProperty } from '@nestjs/swagger';

export class StatusOkDto {
    @ApiProperty({
        type: String,
        example: '200',
        description: 'Status of the response',
    })
    status: number;
}
