import { IDailyRecordRepository } from '@attendance/domain/models/AttDailyRecord';

import fillRestTime from './fillRestTime';
import save from './save';
import saveFields from './saveFields';
import saveRemarks from './saveRemarks';

const repository: IDailyRecordRepository = {
  save,
  fillRestTime,
  saveRemarks,
  saveFields,
};

export default repository;
