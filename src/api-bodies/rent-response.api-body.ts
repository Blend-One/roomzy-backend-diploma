import { ApiProperty } from '@nestjs/swagger';

class RentUserDto {
    @ApiProperty({
        type: String,
        example: '54b734c-2105-46ca-805e-93a9a2e6bac1',
        description: "ID of rent's owner",
    })
    id: string;

    @ApiProperty({
        type: String,
        example: 'email@email.email',
        description: "Email of rent's owner",
    })
    email: string;

    @ApiProperty({
        type: String,
        example: 'null',
        description: 'First name of owner (nullable)',
    })
    firstName: string;

    @ApiProperty({
        type: String,
        example: 'null',
        description: 'Last name of owner (nullable)',
    })
    lastName: string;
}

class RentRoomDto {
    @ApiProperty({
        type: String,
        example: '20000',
        description: 'Price per unit',
    })
    price: string;

    @ApiProperty({
        type: String,
        example: 'PER_MONTH',
        description: 'Price unit',
    })
    priceUnit: string;

    @ApiProperty({
        type: String,
        example: 'OPENED',
        description: "Room's status",
    })
    status: string;

    @ApiProperty({
        type: Boolean,
        example: 'true',
        description: 'Is deposit implied for room?',
    })
    hasDeposit: string;

    @ApiProperty({
        type: String,
        example: '80000',
        description: "Room's title",
    })
    title: string;
}

export class CreateRentResponseDto {
    @ApiProperty({
        type: String,
        example: '144b734c-2105-46ca-805e-93a9a2e6bac1',
        description: 'ID of the created rent',
    })
    id: string;

    @ApiProperty({
        type: String,
        example: 'e84b734c-2105-46ca-805e-93a9a2e6bac1',
        description: 'ID of room',
    })
    roomId: string;

    @ApiProperty({
        type: String,
        example: 'dfd0b734c-2105-46ca-805e-93a9a2e6bac1',
        description: "ID of the rent's owner",
    })
    userId: string;

    @ApiProperty({
        type: String,
        example: 'OPENED',
        description: 'Status of the rent',
    })
    rentStatus: string;

    @ApiProperty({
        type: Number,
        example: '80000',
        description: "Total rent's amount",
    })
    totalPrice: string;

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

    @ApiProperty({
        type: String,
        example: null,
        description: "Date of rent's payment",
    })
    paymentDate: string | null;
}

export class RentResponseDto extends CreateRentResponseDto {
    @ApiProperty({
        type: RentUserDto,
    })
    user: RentUserDto;

    @ApiProperty({
        type: RentRoomDto,
    })
    room: RentRoomDto;
}
