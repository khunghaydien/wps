import TimesheetRepository from '../../../repositories/attendance/TimesheetRepository';

export const loadTimesheet = (targetDate: string) =>
  TimesheetRepository.fetch(targetDate);
