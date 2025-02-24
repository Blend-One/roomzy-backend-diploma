import { Inject, Injectable } from '@nestjs/common';
import { S3_PROVIDE_TOKEN } from 'modules/s3.module';
import { S3Client } from '@aws-sdk/client-s3';

@Injectable()
export class S3Service {
    constructor(@Inject(S3_PROVIDE_TOKEN) private readonly s3Client: S3Client) {}
}
