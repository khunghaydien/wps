import Api from '../../../commons/api';

import { IDailyRecordRepository } from '@attendance/domain/models/AttDailyRecord';

const saveRemarks: IDailyRecordRepository['saveRemarks'] = (param) =>
  Api.invoke({
    path: '/att/daily-remarks/save',
    param,
  });

export default saveRemarks;
