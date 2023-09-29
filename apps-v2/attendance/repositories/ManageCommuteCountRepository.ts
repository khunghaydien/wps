import Api from '../../commons/api';

import adapter from '@apps/repositories/adapters';

import { CommuteCount } from '@attendance/domain/models/CommuteCount';

export default {
  /**
   * Execute to update commute counts.
   */
  update: (param: {
    commuteCount: CommuteCount;
    targetDate?: string;
    employeeId?: string;
  }) => {
    return Api.invoke({
      path: '/att/daily-commute-count/save',
      param: adapter.toRemote({
        empId: param.employeeId,
        targetDate: param.targetDate,
        commuteForwardCount: param.commuteCount.forwardCount,
        commuteBackwardCount: param.commuteCount.backwardCount,
      }),
    });
  },
};
