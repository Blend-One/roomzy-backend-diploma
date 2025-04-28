import { Controller } from '@nestjs/common';
import { RENT_ROUTES } from 'routes/rent.routes';

@Controller({ path: RENT_ROUTES.DEFAULT })
export class RentController {}
