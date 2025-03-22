import { CreateDetailsDto, DetailsResponseDto, PatchDetailsDto } from './create-details.api-body';
import { ApiProperty } from '@nestjs/swagger';
import { IdWithNameDto } from './id-with-name.api-body';

export class CreateCharDetailsDto extends CreateDetailsDto {
    @ApiProperty({
        type: [String],
        example: ['e84b734c-2105-46ca-805e-93a9a2e6bac1', 'gfw3734c-2105-46ca-805e-93a9afde45y6'],
        description: 'Ids of attributes which should be related with characteristic',
    })
    attributeIds: string[];
}

export class PatchCharDetailsDto extends PatchDetailsDto {
    @ApiProperty({
        required: false,
        type: [String],
        example: ['e84b734c-2105-46ca-805e-93a9a2e6bac1', 'gfw3734c-2105-46ca-805e-93a9afde45y6'],
        description: 'Ids of attributes which should be related with characteristic',
    })
    attributeIds: string[];
}

export class CharResponseDto extends DetailsResponseDto {
    @ApiProperty({
        type: String,
        example: 'OPTIONS',
        description:
            "Type of char's value. Implies that we maybe will have another type of value for char, " +
            'instead of early prepared db values. ' +
            'Maybe is it required to allow user to specify value by his own, and according to that type will be different. ' +
            'But by default type is OPTIONS',
    })
    type: string;
}

export class CharWithAttributesDto extends IdWithNameDto {
    @ApiProperty({
        type: [IdWithNameDto],
        example: [
            {
                id: 'CEILING_2_5',
                name: '2.5 м',
            },
            {
                id: 'CEILING_3',
                name: '3 м',
            },
        ],
        description: 'Array of attributes',
    })
    attributes: IdWithNameDto[];
}
