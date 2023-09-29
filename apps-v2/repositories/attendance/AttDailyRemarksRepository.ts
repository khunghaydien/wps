import Api from '../../commons/api';

import { DailyRemarks } from '../../domain/models/attendance/AttDailyRecord';

import adapter from '../adapters';

export default {
  /**
   * Execute to update an AttDailyRecord.remarks
   */
  update: (params: DailyRemarks): Promise<any> => {
    return Api.invoke({
      path: '/att/daily-remarks/save',
      param: adapter.toRemote(params),
    });
  },
};
