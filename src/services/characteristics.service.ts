import { Injectable } from '@nestjs/common';
import { DetailsRepository } from '../repositories/details.repository';
import { Locale } from '../models/enums/locale.enum';

@Injectable()
export class CharacteristicsService {
    constructor(private readonly detailsRepository: DetailsRepository) {}

    public async getAllCharacteristics(name: string, page: number, limit: number, locale: Locale) {}

    public async createAttribute() {}

    public async createCharacteristic() {}

    public async updateAttribute() {}
}
