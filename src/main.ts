import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as bodyParser from 'body-parser';
import { SWAGGER_TITLE } from './constants/swagger.constants';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as cloneBuffer from 'clone-buffer';
import { STRIPE_SIGNATURE_HEADER } from './constants/payment.constants';

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);
    app.enableCors({ origin: true, credentials: true });
    app.use(
        bodyParser.json({
            verify(req, res, buf) {
                if (req.headers[STRIPE_SIGNATURE_HEADER] && Buffer.isBuffer(buf)) {
                    (req as any).rawBody = cloneBuffer(buf);
                }

                return true;
            },
            limit: '10mb',
        }),
    );
    app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
    app.disable('x-powered-by');

    const config = new DocumentBuilder()
        .addServer(process.env.NODE_ENV === 'PRODUCTION' ? '/api' : '')
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
