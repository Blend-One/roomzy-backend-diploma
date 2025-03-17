import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { SWAGGER_TITLE } from './constants/swagger.constants';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.enableCors({ origin: true, credentials: true });

    const config = new DocumentBuilder().setTitle(SWAGGER_TITLE).setVersion('0.0.1').addBearerAuth().build();

    const documentFactory = () => SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('swagger', app, documentFactory);

    await app.listen(process.env.PORT || 8080);
}

bootstrap();
