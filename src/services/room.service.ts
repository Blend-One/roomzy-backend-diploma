import { BadRequestException, ForbiddenException, HttpStatus, Injectable } from '@nestjs/common';
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
import { FiltersDto, PaginatedFilters } from '../models/dtos/fitlers.dto';
import { calculatePaginationData } from '../utils/calculate-pagination-data.utils';
import { Locale } from '../models/enums/locale.enum';
import { RoomStatus } from '../models/enums/room-status.enum';
import { AUTH_ERRORS } from '../errors/auth.errors';
import { UpdateRoomRequestDto } from '../models/requests-schemas/update-ad.request';
import { ROOM_ERRORS } from '../errors/room.errors';

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

    public async prepareDataForAd(request: Request, images: Array<Express.Multer.File>, sections: string) {
        const user = request.headers['user'];
        const compressedImages = images?.length
            ? await Promise.all(images.map(image => this.sharpService.compress(image)))
            : [];
        const transformedSections = sections ? JSON.parse(sections) : [];
        const imageIds = compressedImages.map(() => uuidv4());
        validateSections(transformedSections);
        return { user, compressedImages, transformedSections, imageIds };
    }

    public async createAd(
        createAdDto: Required<CreateRoomRequestDto>,
        images: Array<Express.Multer.File>,
        request: Request,
    ) {
        const { sections, ...roomValues } = createAdDto;
        const { user, compressedImages, transformedSections, imageIds } = await this.prepareDataForAd(
            request,
            images,
            sections,
        );
        const result = await this.commonRepository.createTransactionWithCallback(async prisma => {
            const ad = await this.roomRepository.createAd({
                room: roomValues,
                sections: transformedSections,
                transactionPrisma: prisma,
                userId: user.id,
            });

            const imageRecords = await this.imageRepository.bulkCreateImages({
                files: compressedImages,
                imageIds,
                roomId: ad.id,
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

    public async getAds(filters: FiltersDto, locale: Locale, page: number, limit: number) {
        const { take, skip } = calculatePaginationData(page, limit);
        return this.roomRepository.getAds(filters, RoomStatus.OPENED, take, skip, locale);
    }

    public async getPersonalAds(status: RoomStatus, locale: Locale, page: number, limit: number, userId: string) {
        const { take, skip } = calculatePaginationData(page, limit);
        return this.roomRepository.getAds(null, status, take, skip, locale, userId);
    }

    public async getAd(id: string, locale: Locale) {}

    public async changeAdStatus(roomId: string, status: RoomStatus, userId: string) {
        if (![RoomStatus.OPENED, RoomStatus.ARCHIVED].includes(status)) {
            throw new ForbiddenException(AUTH_ERRORS.FORBIDDEN);
        }
        const room = await this.roomRepository.getRoomByUserAndRoomIds(roomId, userId);
        if (![RoomStatus.OPENED, RoomStatus.ARCHIVED].includes(room.status as RoomStatus) || status === room.status) {
            throw new ForbiddenException(AUTH_ERRORS.FORBIDDEN);
        }

        await this.roomRepository.changeAdStatus(roomId, status);

        return { message: HttpStatus.OK };
    }

    public async changeInModerationAdStatus(roomId: string, status: RoomStatus) {
        if ([RoomStatus.ARCHIVED, RoomStatus.RENTED, RoomStatus.RESERVED].includes(status)) {
            throw new ForbiddenException(AUTH_ERRORS.FORBIDDEN);
        }

        const room = await this.roomRepository.getRoomByUserAndRoomIds(roomId);

        if (![RoomStatus.IN_MODERATION, RoomStatus.REJECTED, RoomStatus.OPENED].includes(room.status as RoomStatus)) {
            throw new ForbiddenException(AUTH_ERRORS.FORBIDDEN);
        }

        await this.roomRepository.changeAdStatus(roomId, status);

        return { message: HttpStatus.OK };
    }

    public async getAdsForModeration(filters: PaginatedFilters, locale: Locale) {
        const { take, skip } = calculatePaginationData(filters.page, filters.limit);
        return this.roomRepository.getAds(filters, RoomStatus.IN_MODERATION, take, skip, locale);
    }

    public async updateAd(
        updateAdDto: UpdateRoomRequestDto,
        images: Array<Express.Multer.File>,
        request: Request,
        roomId: string,
    ) {
        if (!Object.keys(updateAdDto).length) throw new BadRequestException(ROOM_ERRORS.NOTHING_TO_UPDATE);

        const { sections, sectionsToDelete, imagesToDelete, ...roomValues } = updateAdDto;

        const { user, compressedImages, transformedSections, imageIds } = await this.prepareDataForAd(
            request,
            images,
            sections,
        );

        const parsedImagesToDelete = imagesToDelete ? JSON.parse(imagesToDelete) : [];
        const parsedSectionsToDelete = sectionsToDelete ? JSON.parse(sectionsToDelete) : [];

        if (!(Array.isArray(parsedImagesToDelete) || Array.isArray(parsedSectionsToDelete))) {
            throw new BadRequestException(ROOM_ERRORS.INCORRECT_SECTIONS_FORMAT);
        }

        const result = await this.commonRepository.createTransactionWithCallback(async prisma => {
            const ad = await this.roomRepository.updateAd({
                room: roomValues,
                sections: transformedSections,
                transactionPrisma: prisma,
                userId: user.id,
                roomId,
                imagesToDelete: parsedImagesToDelete,
                sectionsToDelete: parsedSectionsToDelete,
            });

            const imageRecords = await this.imageRepository.bulkCreateImages({
                files: compressedImages,
                imageIds,
                roomId,
                transactionPrisma: prisma,
            });

            try {
                await Promise.all([
                    this.s3Service.bulkDelete(S3Bucket.PHOTOS, parsedImagesToDelete),
                    this.s3Service.bulkUploadTo(S3Bucket.PHOTOS, compressedImages, imageIds),
                ]);
                return { ad, imageRecords };
            } catch (err) {
                throw err;
            }
        });

        return result;
    }
}
