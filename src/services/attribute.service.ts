import { Injectable } from '@nestjs/common';
import { Locale } from '../models/enums/locale.enum';
import { DetailsRepository } from '../repositories/details.repository';

@Injectable()
export class AttributeService {
    constructor(private readonly detailsRepository: DetailsRepository) {}

    public async getAllAttributes(name: string, page: number, limit: number, locale: Locale) {}

    public async createAttribute() {}

    public async createCharacteristic() {}

    public async updateAttribute() {}
}
