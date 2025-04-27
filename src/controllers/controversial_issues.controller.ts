import { Controller } from '@nestjs/common';
import { CONTROVERSIAL_ISSUES_ROUTES } from '../routes/controversial-issues.routes';

@Controller({ path: CONTROVERSIAL_ISSUES_ROUTES.DEFAULT })
export class ControversialIssuesController {}
