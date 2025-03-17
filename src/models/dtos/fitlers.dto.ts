import { RangeDto } from './range.dto';
import { PriceUnit } from '../enums/price-unit.enum';
import { Paginated } from '../../types/paginated.types';

interface SectionValue {
    floorNumber: number;
    sectionTypeId: string;
    values: Record<string, string>;
}

export interface FiltersDto {
    title: string;
    priceRange: RangeDto;
    priceUnit: PriceUnit;
    physControl: boolean;
    accessInstructions: boolean;
    districtIds: string[];
    cityId: string;
    isCommercial: boolean;
    square: RangeDto;
    roomTypeId: string;
    defaultValues?: Record<string, string>;
    sections: SectionValue[];
    hasDeposit: boolean;
}

export type PaginatedFilters = Paginated<FiltersDto>;
