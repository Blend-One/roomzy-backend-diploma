import { ApiProperty } from '@nestjs/swagger';
import { CreateDescriptionDto } from './create-controversial-issues.api-body';

export class ControversialIssuesDto {
    @ApiProperty({
        type: String,
        example: '54b734c-2105-46ca-805e-93a9a2e6bac1',
        description: 'ID of issue',
    })
    id: string;

    @ApiProperty({
        type: String,
        example: '98b734c-2105-46ca-805e-93a9a2e6bac1',
        description: 'ID of room where this issue was attached',
    })
    roomId: string;

    @ApiProperty({
        type: String,
        example: '18b734c-2105-46ca-805e-93a9a2e6bac1',
        description: 'ID of rent where this issue was attached',
    })
    rentId: string;

    @ApiProperty({
        type: String,
        example: '90b734c-2105-46ca-805e-93a9a2e6bac1',
        description: "ID of the issue's image",
    })
    imageId: string;

    @ApiProperty({
        type: String,
        example: 'Big hole on the floor',
        description: 'Description of the issue',
    })
    description: string;

    @ApiProperty({
        type: String,
        example: '2025-05-03T22:21:31.671Z',
        description: 'Date when it was attached',
    })
    date: string;
}

export class ControversialIssuesForModerationDto {
    @ApiProperty({
        type: [ControversialIssuesDto],
        required: true,
        description: 'Controversial issues',
    })
    controversialIssues: ControversialIssuesDto[];

    @ApiProperty({
        type: String,
        required: true,
        example: '018b734c-2105-46ca-805e-93a9a2e6bac1',
        description: 'ID of the rent where controversial issues were attached',
    })
    rentId: string;
}
