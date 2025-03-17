import { ApiProperty } from '@nestjs/swagger';

export class IdWithNameDto {
    @ApiProperty({
        type: String,
        example: 'ID',
        description: 'The unique identifier',
    })
    id: string;

    @ApiProperty({
        type: String,
        example: 'NAME',
        description: 'The name of the data instance.',
    })
    name: string;
}
