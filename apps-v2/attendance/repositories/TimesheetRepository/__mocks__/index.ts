import availableDailyRequestResponseResult from '@apps/attendance/repositories/__tests__/mocks/att__available-daily-request__list';
import timesheet from '@attendance/repositories/__tests__/mocks/timesheet-get--fixed-time';

export default {
  fetchRaw: jest.fn().mockResolvedValue(timesheet),
  fetch: jest.fn(),
  fetchAvailableDailyRequest: jest
    .fn()
    .mockResolvedValue(availableDailyRequestResponseResult),
};
