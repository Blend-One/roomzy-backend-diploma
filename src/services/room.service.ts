import { BadRequestException, ForbiddenException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoomRequestDto } from 'models/requests-schemas/create-ad.request';
import { CommonRepository } from 'repositories/common.repository';
import { ImageRepository } from 'repositories/image.repository';
import { RoomRepository } from 'repositories/room.repository';
import { SharpService } from './sharp.service';
import { S3Service } from './s3.service';
import { v4 as uuidv4 } from 'uuid';
import { S3Bucket } from 'models/enums/s3-bucket.enum';
import { validateSections } from 'utils/validate-sections.utils';
import { FiltersDto } from 'models/dtos/fitlers.dto';
import { calculatePaginationData } from 'utils/calculate-pagination-data.utils';
import { Locale } from 'models/enums/locale.enum';
import { RoomStatus } from 'models/enums/room-status.enum';
import { AUTH_ERRORS } from 'errors/auth.errors';
import { UpdateRoomRequestDto } from 'models/requests-schemas/update-ad.request';
import { ROOM_ERRORS } from 'errors/room.errors';
import { Role } from 'models/enums/role.enum';
import { MODERATION_FIELDS } from 'constants/room.constants';
import { isValueObject } from '../utils/is-object.utils';
import { DEFAULT_SECTION } from '../constants/details.constants';
import { transformQueryResult } from '../utils/transform-query-result.utils';

@Injectable()
export class RoomService {
    constructor(
        private imageRepository: ImageRepository,
        private roomRepository: RoomRepository,
        private commonRepository: CommonRepository,
        private sharpService: SharpService,
        private s3Service: S3Service,
    ) {}

    private checkSwitchingToModerationStatus(files: Express.Multer.File[], queryKeys: string[]) {
        if (!!files?.length) return true;
        return !!queryKeys?.length && queryKeys.some(key => MODERATION_FIELDS.includes(key));
    }

    public async prepareDataForAd(
        request: Request,
        images: Array<Express.Multer.File>,
        roomTypeId: string,
        sections: string,
        defaultSection: string,
    ) {
        const user = request.headers['user'];
        const compressedImages = images?.length
            ? await Promise.all(images.map(image => this.sharpService.compress(image)))
            : [];
        const transformedDefaultSection = defaultSection ? JSON.parse(defaultSection) : null;
        const transformedSections = sections ? JSON.parse(sections) : [];
        const isDefaultSectionObject = isValueObject(transformedDefaultSection);
        if (isDefaultSectionObject && Array.isArray(transformedSections)) {
            transformedSections.unshift({
                roomSectionTypeId: `${roomTypeId}_${DEFAULT_SECTION}`,
                sectionAttributeValues: transformedDefaultSection,
            });
        }
        const imageIds = compressedImages.map(() => uuidv4());
        validateSections(transformedSections);
        return { user, compressedImages, transformedSections, imageIds };
    }

    public async createAd(
        createAdDto: Required<CreateRoomRequestDto>,
        images: Array<Express.Multer.File>,
        request: Request,
    ) {
        const { sections, defaultOptions, ...roomValues } = createAdDto;
        const { user, compressedImages, transformedSections, imageIds } = await this.prepareDataForAd(
            request,
            images,
            roomValues.roomTypeId,
            sections,
            defaultOptions,
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
        const ads = await this.roomRepository.getAds(filters, RoomStatus.OPENED, take, skip, locale);
        return transformQueryResult(
            {
                renamedFields: { [locale]: 'name' },
                objectParsingSequence: ['roomType', 'city', 'district'],
            },
            ads,
        );
    }

    public async getPersonalAds(status: RoomStatus, locale: Locale, page: number, limit: number, userId: string) {
        const { take, skip } = calculatePaginationData(page, limit);
        const ads = await this.roomRepository.getAds(null, status, take, skip, locale, userId);
        return transformQueryResult(
            {
                renamedFields: { [locale]: 'name' },
                objectParsingSequence: ['roomType', 'city', 'district'],
            },
            ads,
        );
    }

    public async getAd(id: string, locale: Locale, userId: string | null, userRole: Role | null) {
        const room = await this.roomRepository.getAd(id, locale);
        if (!room) throw new NotFoundException(ROOM_ERRORS.ROOM_NOT_FOUND);
        if (room.status !== RoomStatus.OPENED && room.userId !== userId && userRole !== Role.MANAGER)
            throw new ForbiddenException(AUTH_ERRORS.FORBIDDEN);
        return transformQueryResult(
            {
                renamedFields: {
                    [locale]: 'name',
                },
                objectParsingSequence: [
                    'roomType',
                    'district',
                    'city',
                    'roomSections',
                    'roomSectionType',
                    'sectionAttributeValues',
                    'characteristic',
                    'attribute',
                ],
            },
            room,
        );
    }

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

        if (
            ![RoomStatus.IN_MODERATION, RoomStatus.REJECTED, RoomStatus.OPENED].includes(room.status as RoomStatus) ||
            status === room.status
        ) {
            throw new ForbiddenException(AUTH_ERRORS.FORBIDDEN);
        }

        await this.roomRepository.changeAdStatus(roomId, status);

        return { message: HttpStatus.OK };
    }

    public async getAdsForModeration(filters: FiltersDto, locale: Locale, page: number, limit: number) {
        const { take, skip } = calculatePaginationData(page, limit);
        const ads = await this.roomRepository.getAds(filters, RoomStatus.IN_MODERATION, take, skip, locale);
        return transformQueryResult(
            {
                renamedFields: { [locale]: 'name' },
                objectParsingSequence: ['roomType', 'city', 'district'],
            },
            ads,
        );
    }

    public async updateAd(
        updateAdDto: UpdateRoomRequestDto,
        images: Array<Express.Multer.File>,
        request: Request,
        roomId: string,
    ) {
        if (!Object.keys(updateAdDto).length) throw new BadRequestException(ROOM_ERRORS.NOTHING_TO_UPDATE);

        const { sections, sectionsToDelete, imagesToDelete, defaultOptions, ...roomValues } = updateAdDto;

        const { user, compressedImages, transformedSections, imageIds } = await this.prepareDataForAd(
            request,
            images,
            roomValues.roomTypeId,
            sections,
            defaultOptions,
        );

        const shouldSwitchToModerationStatus = this.checkSwitchingToModerationStatus(
            images,
            Object.keys(updateAdDto ?? {}),
        );

        const parsedImagesToDelete = imagesToDelete ? JSON.parse(imagesToDelete) : [];
        const parsedSectionsToDelete = sectionsToDelete ? JSON.parse(sectionsToDelete) : [];

        if (!(Array.isArray(parsedImagesToDelete) || Array.isArray(parsedSectionsToDelete))) {
            throw new BadRequestException(ROOM_ERRORS.INCORRECT_SECTIONS_FORMAT);
        }

        const result = await this.commonRepository
            .createTransactionWithCallback(async prisma => {
                const ad = await this.roomRepository.updateAd({
                    room: roomValues,
                    sections: transformedSections,
                    transactionPrisma: prisma,
                    userId: user.id,
                    roomId,
                    imagesToDelete: parsedImagesToDelete,
                    sectionsToDelete: parsedSectionsToDelete,
                    shouldSwitchToModerationStatus,
                });

                let imageRecords = [];

                if (!!images?.length) {
                    imageRecords = await this.imageRepository.bulkCreateImages({
                        files: compressedImages,
                        imageIds,
                        roomId,
                        transactionPrisma: prisma,
                    });
                }
                try {
                    await Promise.all([
                        this.s3Service.bulkDelete(S3Bucket.PHOTOS, parsedImagesToDelete),
                        this.s3Service.bulkUploadTo(S3Bucket.PHOTOS, compressedImages, imageIds),
                    ]);
                    return { ad, imageRecords };
                } catch (err) {
                    throw err;
                }
            })
            .catch(err => {
                throw new BadRequestException(ROOM_ERRORS.ROOM_NOT_FOUND);
            });

        return result;
    }
}
