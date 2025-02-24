import { Controller } from '@nestjs/common';
import { DICT_ROUTES } from '../routes/dict.routes';

@Controller({
    path: DICT_ROUTES.DEFAULT,
})
export class DictController {}
