import { ITimesheetRepository } from '@attendance/domain/models/importer/Timesheet';

export default {
  save: jest.fn(),
  check: jest.fn(),
} as ITimesheetRepository;
