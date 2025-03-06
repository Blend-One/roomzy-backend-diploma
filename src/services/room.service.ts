import { Injectable } from '@nestjs/common';
import { CreateRoomRequestDto } from 'models/requests-schemas/create-ad.request';
import { CommonRepository } from 'repositories/common.repository';
import { ImageRepository } from 'repositories/image.repository';
import { SectionsRepository } from 'repositories/sections.repository';
import { RoomRepository } from 'repositories/room.repository';
import { SharpService } from './sharp.service';
import { S3Service } from './s3.service';
import { v4 as uuidv4 } from 'uuid';
import { S3Bucket } from '../models/enums/s3-bucket.enum';

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
        const imageIds = compressedImages.map(() => uuidv4());
        const [ad, _, imageRecords] = await this.commonRepository.createTransaction([
            this.roomRepository.createAd(roomValues, sections, roomId),
            this.s3Service.bulkUploadTo(S3Bucket.PHOTOS, compressedImages, imageIds),
            this.imageRepository.bulkCreateImages(compressedImages, imageIds, roomId),
        ]);

        return { ad, imageRecords };
    }

    public async getAds() {}

    public async changeAdStatus() {}

    public async getAdsForModeration() {}

    public async updateAd() {}
}
