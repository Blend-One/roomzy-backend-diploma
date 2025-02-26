import { Module } from '@nestjs/common';
import { AttributeController } from 'controllers/attribute.controller';

@Module({
    imports: [],
    controllers: [AttributeController],
    providers: [],
})
export default class AttributeModule {}
