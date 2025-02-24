import { Controller } from '@nestjs/common';
import { ATTRIBUTE_ROUTES } from 'routes/attribute.routes';

@Controller({ path: ATTRIBUTE_ROUTES.DEFAULT })
export class AttributeController {}
