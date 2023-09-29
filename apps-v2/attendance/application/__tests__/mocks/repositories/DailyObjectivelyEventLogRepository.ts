import { IDailyObjectivelyEventLogRepository } from '@attendance/domain/models/DailyObjectivelyEventLog';

export default {
  search: jest.fn(),
  saveDeviationReason: jest.fn(),
  setToBeApplied: jest.fn(),
} as IDailyObjectivelyEventLogRepository;
