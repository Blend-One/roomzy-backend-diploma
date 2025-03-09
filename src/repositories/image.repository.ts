import { Injectable } from '@nestjs/common';
import { PrismaService } from '../services/prisma.service';
import { WithTransactionPrisma } from '../types/transaction-prisma.types';

@Injectable()
export class ImageRepository {
    constructor(private prisma: PrismaService) {}

    public async createImage(id: string, roomId: string, name: string) {
        return this.prisma.roomImage.create({
            data: {
                id,
                roomId,
                name,
            },
        });
    }

    public async deleteImage(imageId: string) {
        return this.prisma.user.delete({
            where: { id: imageId },
        });
    }

    public async getImage(imageId: string) {
        return this.prisma.roomImage.findUnique({
            where: { id: imageId },
        });
    }

    public async bulkCreateImages({
        files,
        imageIds,
        roomId,
        transactionPrisma,
    }: WithTransactionPrisma<{
        files: Express.Multer.File[];
        imageIds: string[];
        roomId: string;
    }>) {
        const prismaInstance = transactionPrisma ?? this.prisma;
        return prismaInstance.roomImage.createManyAndReturn({
            data: files.map((file, index) => ({
                id: imageIds[index],
                roomId,
                name: file.filename,
            })),
        });
    }
}
