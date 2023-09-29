import { ITimesheetRepository } from '@attendance/domain/models/Timesheet';

export default {
  fetch: jest.fn(),
  fetchRaw: jest.fn(),
  fetchAvailableDailyRequest: jest.fn(),
} as ITimesheetRepository;
