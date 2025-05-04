import { ApiProperty } from '@nestjs/swagger';

export class CreateDescriptionDto {
    @ApiProperty({
        type: String,
        example: 'Big hole on the floor',
        description: 'Detailed description of issue',
    })
    description: string;
}

export class CreateControversialIssuesDto {
    @ApiProperty({
        type: 'array',
        items: {
            type: 'string',
            maxItems: 10,
            format: 'binary',
        },
        required: false,
    })
    files: Express.Multer.File;

    @ApiProperty({
        type: [CreateDescriptionDto],
        example: [
            {
                description: 'Big hole on the floor',
            },
        ],
        required: true,
        description: 'Descriptions of controversial issues. Should be ordered according to the images order',
    })
    descriptions: string;
}
