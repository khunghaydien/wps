import TimesheetRepository from '@attendance/repositories/TimesheetRepository';

export const loadTimesheet = (targetDate: string) =>
  TimesheetRepository.fetch(targetDate);
