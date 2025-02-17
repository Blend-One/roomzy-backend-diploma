import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from 'modules/user.module';
import { JwtModule } from '@nestjs/jwt';
import * as process from 'node:process';

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
    ],
})
export class AppModule {}
