import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateRoomRequestDto } from 'models/requests-schemas/create-ad.request';
import { CommonRepository } from 'repositories/common.repository';
import { ImageRepository } from 'repositories/image.repository';
import { SectionsRepository } from 'repositories/sections.repository';
import { RoomRepository } from 'repositories/room.repository';
import { SharpService } from './sharp.service';
import { S3Service } from './s3.service';
import { v4 as uuidv4 } from 'uuid';
import { S3Bucket } from '../models/enums/s3-bucket.enum';
import { validateSections } from '../utils/validate-sections.utils';

@Injectable()
export class RoomService {
    constructor(
        private imageRepository: ImageRepository,
        private sectionsRepository: SectionsRepository,
        private roomRepository: RoomRepository,
        private commonRepository: CommonRepository,
        private sharpService: SharpService,
        private s3Service: S3Service,
    ) {}

    public async createAd(createAdDto: CreateRoomRequestDto, images: Array<Express.Multer.File>) {
        const { sections, ...roomValues } = createAdDto;
        const compressedImages = await Promise.all(images.map(image => this.sharpService.compress(image)));
        const roomId = uuidv4();
        const transformedSections = JSON.parse(sections);
        validateSections(transformedSections);
        const imageIds = compressedImages.map(() => uuidv4());
        const result = await this.commonRepository.createTransactionWithCallback(async prisma => {
            const ad = await this.roomRepository.createAd({
                room: roomValues,
                sections: transformedSections,
                roomId,
                transactionPrisma: prisma,
            });
            const imageRecords = await this.imageRepository.bulkCreateImages({
                files: compressedImages,
                imageIds,
                roomId,
                transactionPrisma: prisma,
            });

            try {
                await this.s3Service.bulkUploadTo(S3Bucket.PHOTOS, compressedImages, imageIds);
                return { ad, imageRecords };
            } catch (err) {
                throw err;
            }
        });

        return result;
    }

    public async getAds() {}

    public async changeAdStatus() {}

    public async getAdsForModeration() {}

    public async updateAd() {}
}
