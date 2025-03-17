import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { SWAGGER_TITLE } from './constants/swagger.constants';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);
    app.enableCors({ origin: true, credentials: true });

    app.disable('x-powered-by');

    const config = new DocumentBuilder()
        .addServer(process.env.NODE_ENV === 'production' ? '/api' : '')
        .addGlobalParameters({
            in: 'header',
            required: false,
            name: 'accept-language',
            schema: {
                example: 'kz',
            },
        })
        .setTitle(SWAGGER_TITLE)
        .setVersion('0.0.1')
        .addBearerAuth()
        .build();

    const documentFactory = () => SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('swagger', app, documentFactory);

    await app.listen(process.env.PORT || 8080);
}

bootstrap();
