import { Module } from '@nestjs/common';
import { RentController } from 'controllers/rent.controller';

@Module({
    imports: [],
    controllers: [RentController],
    providers: [],
})
export default class RentModule {}
