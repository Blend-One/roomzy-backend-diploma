import { ApiProperty } from '@nestjs/swagger';

export class CreateDetailsDto {
    @ApiProperty({
        type: String,
        example: 'Плитка',
        description: 'Fallback name of detail.',
    })
    fallbackName: string;

    @ApiProperty({
        type: String,
        example: 'Плитка',
        description: 'Name of detail.',
    })
    ru: string;

    @ApiProperty({
        type: String,
        example: 'Ағаш',
        description: 'Name of detail.',
    })
    kz: string;
}

export class DetailsResponseDto extends CreateDetailsDto {
    @ApiProperty({
        type: String,
        example: 'e84b734c-2105-46ca-805e-93a9a2e6bac1',
        description: 'Id of detail.',
    })
    id: string;
}

export class PatchDetailsDto {
    @ApiProperty({
        type: String,
        example: 'Плитка',
        description: 'Fallback name of detail.',
        required: false,
    })
    fallbackName?: string;

    @ApiProperty({
        type: String,
        example: 'Плитка',
        description: 'Name of detail.',
        required: false,
    })
    ru?: string;

    @ApiProperty({
        type: String,
        example: 'Ағаш',
        description: 'Name of detail.',
        required: false,
    })
    kz?: string;
}
