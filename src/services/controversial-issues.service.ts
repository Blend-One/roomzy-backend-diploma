import { BadRequestException, Injectable } from '@nestjs/common';
import { ControversialIssuesRepository } from '../repositories/controversial-issues.repository';
import RentRepository from '../repositories/rent.repository';
import { RoomRepository } from '../repositories/room.repository';
import { S3Service } from './s3.service';
import { RENT_ERRORS } from '../errors/rent.errors';
import { RentStatus } from '../models/enums/rent-status.enum';
import { checkAreDescriptionsValid } from '../utils/controversial-issues.utils';
import { SharpService } from './sharp.service';
import { v4 as uuidv4 } from 'uuid';
import { CommonRepository } from '../repositories/common.repository';
import { S3Bucket } from '../models/enums/s3-bucket.enum';
import { ROOM_ERRORS } from '../errors/room.errors';

@Injectable()
export class ControversialIssuesService {
    constructor(
        private controversialIssuesRepository: ControversialIssuesRepository,
        private rentRepository: RentRepository,
        private roomRepository: RoomRepository,
        private commonRepository: CommonRepository,
        private s3Service: S3Service,
        private sharpService: SharpService,
    ) {}

    public async createControversialIssues(
        descriptions: string,
        files: Array<Express.Multer.File>,
        userId: string,
        rentId: string,
    ) {
        const foundRent = await this.rentRepository.getRentById(rentId);
        if (!foundRent || foundRent.userId !== userId) {
            throw new BadRequestException(RENT_ERRORS.RENT_NOT_FOUND);
        }

        if (foundRent.rentStatus !== RentStatus.PAID) {
            throw new BadRequestException(RENT_ERRORS.INVALID_RENT);
        }

        const jsonDescriptions = checkAreDescriptionsValid(descriptions);

        const compressedImages = files?.length
            ? await Promise.all(files.map(image => this.sharpService.compress(image)))
            : [];

        const imageIds = compressedImages.map(() => uuidv4());

        const issues = jsonDescriptions.map((description, index) => ({
            ...description,
            imageId: imageIds[index],
        }));

        return this.commonRepository.createTransactionWithCallback(async prisma => {
            const controversialIssues = await this.controversialIssuesRepository.createControversialIssues({
                issues,
                rentId: foundRent.id,
                roomId: foundRent.roomId,
                transactionPrisma: prisma,
            });

            await this.rentRepository.changeRentStatus({
                rentId,
                status: RentStatus.ISSUES_ON_CHECK,
                transactionPrisma: prisma,
            });

            try {
                await this.s3Service.bulkUploadTo(S3Bucket.CONFLICTS, compressedImages, imageIds);
                return { controversialIssues };
            } catch (err) {
                throw new BadRequestException(err?.meta?.cause ?? ROOM_ERRORS.ERROR_WITH_EXTERNAL_RESOURCE);
            }
        });
    }

    public async getControversialIssuesByRentId(userId: string, rentId: string) {}

    public async getControversialIssuesByRoomId(userId: string, roomId: string) {}

    public async getControversialIssuesForModeration() {}

    public async changeStatusForControversialIssues() {}
}
