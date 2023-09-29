import { IDailyRestRecordRepository } from '@attendance/domain/models/DailyRestRecord';

import search from './search';

const repository: IDailyRestRecordRepository = {
  search,
};

export default repository;
