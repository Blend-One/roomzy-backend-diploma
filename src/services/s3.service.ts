import { Injectable } from '@nestjs/common';
import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { S3Bucket } from '../models/enums/s3-bucket.enum';

@Injectable()
export class S3Service {
    private s3: S3Client;
    private buckets: Record<S3Bucket, string>;

    constructor() {
        this.s3 = new S3Client({
            region: process.env.S3_REGION,
            endpoint: process.env.S3_ENDPOINT,
            credentials: {
                accessKeyId: process.env.S3_ACCESS_KEY,
                secretAccessKey: process.env.S3_SECRET_KEY,
            },
        });

        this.buckets = {
            [S3Bucket.PHOTOS]: process.env.S3_PHOTOS_BUCKET_NAME,
            [S3Bucket.CONFLICTS]: process.env.S3_CONFLICTS_BUCKET_NAME,
        };
    }

    private getParams(bucketName: S3Bucket, fileName: string, fileContent?: Buffer, mimeType?: string) {
        const params = {
            Bucket: this.buckets[bucketName],
            Key: fileName,
            Body: fileContent,
            ContentType: mimeType,
        };

        if (fileContent) {
            params.Body = fileContent;
        }

        if (mimeType) {
            params.ContentType = mimeType;
        }

        return params;
    }

    private async uploadFile(bucketName: S3Bucket, file: Express.Multer.File, fileKey: string) {
        const params = this.getParams(bucketName, fileKey, file.buffer, file.mimetype);
        const command = new PutObjectCommand(params);
        await this.s3.send(command);
        return { fileKey, ...file };
    }

    async deleteFile(bucketName: S3Bucket, fileKey: string) {
        const params = this.getParams(bucketName, fileKey);
        const command = new DeleteObjectCommand(params);
        await this.s3.send(command);
    }

    async getFile(bucketName: S3Bucket, fileKey: string) {
        const params = this.getParams(bucketName, fileKey);
        const command = new GetObjectCommand(params);
        return this.s3.send(command);
    }

    async bulkUploadTo(bucketName: S3Bucket, files: Express.Multer.File[], imageIds: string[]) {
        return Promise.all(files.map((file, index) => this.uploadFile(bucketName, file, imageIds[index])));
    }
}
