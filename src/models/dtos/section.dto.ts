import { SectionAttributeValueDto } from './section-attribute-value.dto';

export interface RoomSectionDto {
    floor: number;
    sectionTypeId: string;
    roomId: string;
    sectionAttributeValues: SectionAttributeValueDto[];
}
