import { Module } from '@nestjs/common';
import { S3Client } from '@aws-sdk/client-s3';
import { S3Service } from 'services/s3.service';

export const S3_PROVIDE_TOKEN = 'S3_PROVIDE_TOKEN';

@Module({
    providers: [
        {
            provide: S3_PROVIDE_TOKEN,
            useFactory: () => {
                const accessKey = process.env.S3_ACCESS_KEY;
                const secretAccessKey = process.env.S3_SECRET_KEY;

                return new S3Client({
                    credentials: {
                        accessKeyId: accessKey,
                        secretAccessKey,
                    },
                });
            },
        },
        S3Service,
    ],
})
export default class S3Module {}
