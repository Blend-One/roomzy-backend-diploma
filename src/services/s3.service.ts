import { Injectable } from '@nestjs/common';
import { S3Client } from '@aws-sdk/client-s3';

@Injectable()
export class S3Service {
    private s3: S3Client;
    constructor() {
        this.s3 = new S3Client({
            region: process.env.S3_REGION,
            endpoint: process.env.S3_ENDPOINT,
            credentials: {
                accessKeyId: process.env.S3_ACCESS_KEY,
                secretAccessKey: process.env.S3_SECRET_KEY,
            },
        });
    }

    uploadFile() {}

    deleteFile() {}
}
