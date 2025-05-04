import { ApiProperty } from '@nestjs/swagger';

export class InstructionsDto {
    @ApiProperty({
        type: String,
        example: 'You can get to the building through main entrance',
        description: "Room's instruction",
    })
    instructions: string;
}
