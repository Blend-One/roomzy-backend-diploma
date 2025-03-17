import { ApiProperty } from '@nestjs/swagger';

export class RangeDto {
    @ApiProperty({
        type: Number,
        example: 10,
        description: 'The minimum value of the range.',
    })
    min: number;

    @ApiProperty({
        type: Number,
        example: 100,
        description: 'The maximum value of the range.',
    })
    max: number;
}
