import { IDailyObjectivelyEventLogRepository } from '@attendance/domain/models/DailyObjectivelyEventLog';

import saveDeviationReason from './saveDeviationReason';
import search from './search';
import setToBeApplied from './setToBeApplied';

const repository: IDailyObjectivelyEventLogRepository = {
  search,
  saveDeviationReason,
  setToBeApplied,
};

export default repository;
