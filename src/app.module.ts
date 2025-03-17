import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import UserModule from 'modules/user.module';
import RoomModule from 'modules/room.module';
import DetailsModule from 'modules/details.module';
import RentModule from 'modules/rent.module';
import { JwtModule } from '@nestjs/jwt';
import ImageModule from './modules/image.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env',
        }),
        JwtModule.register({
            global: true,
            secret: process.env.ACCESS_SECRET,
            signOptions: { expiresIn: process.env.ACCESS_EXPIRES_IN || '30d' },
        }),
        UserModule,
        RoomModule,
        DetailsModule,
        RentModule,
        ImageModule,
    ],
})
export class AppModule {}
