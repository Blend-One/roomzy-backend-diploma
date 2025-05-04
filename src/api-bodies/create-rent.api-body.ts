import { ApiProperty } from '@nestjs/swagger';

export class CreateRentDto {
    @ApiProperty({
        type: String,
        example: 'e84b734c-2105-46ca-805e-93a9a2e6bac1',
        description: 'ID of room',
    })
    roomId: string;

    @ApiProperty({
        type: String,
        example: '2025-05-03T22:21:31.671Z',
        description: 'Start of renting the room. Should be not less than current date',
    })
    issuedDate: string;

    @ApiProperty({
        type: String,
        example: '2025-06-03T22:21:31.671Z',
        description:
            "End of renting. Should be depending on price unit and difference between specific units mustn'be less or equal to 0",
    })
    dueDate: string;
}
