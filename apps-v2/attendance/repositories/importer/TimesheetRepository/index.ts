import { ITimesheetRepository } from '@attendance/domain/models/importer/Timesheet';

import check from './check';
import save from './save';

export default {
  save,
  check,
} as ITimesheetRepository;
