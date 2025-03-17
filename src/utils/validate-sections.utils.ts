import { SectionRoomSchemaDto } from '../models/requests-schemas/create-ad.request';
import { BadRequestException } from '@nestjs/common';
import { ROOM_ERRORS } from '../errors/room.errors';

export const validateSections = (sections: SectionRoomSchemaDto) => {
    sections.forEach(section => {
        if (!(section?.sectionAttributeValues?.length || section?.roomSectionTypeId || section?.floorNumber)) {
            throw new BadRequestException(ROOM_ERRORS.INCORRECT_SECTIONS_FORMAT);
        }
    });
};
