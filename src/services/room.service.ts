import { Injectable } from '@nestjs/common';
import { CreateRoomRequestDto } from '../models/requests-schemas/create-ad.request';

@Injectable()
export class RoomService {
    public async createAd(createAdDto: CreateRoomRequestDto) {}

    public async getAds() {}

    public async changeAdStatus() {}

    public async getAdsForModeration() {}

    public async updateAd() {}
}
