import { ApiProperty } from '@nestjs/swagger';

export class AuthUserDto {
    @ApiProperty({ example: 'email@email.email', description: 'The email of the user' })
    email: string;

    @ApiProperty({ example: 'password123', description: 'The password of the user' })
    password: string;
}
