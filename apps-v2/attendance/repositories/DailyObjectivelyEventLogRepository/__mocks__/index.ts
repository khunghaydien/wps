import { defaultValue } from '@attendance/domain/models/__tests__/mocks/DailyObjectivelyEventLog.mock';
import { IDailyObjectivelyEventLogRepository } from '@attendance/domain/models/DailyObjectivelyEventLog';

const repository: IDailyObjectivelyEventLogRepository = {
  search: jest.fn().mockResolvedValue([defaultValue]),
  saveDeviationReason: jest.fn(),
  setToBeApplied: jest.fn(),
};

export default repository;
