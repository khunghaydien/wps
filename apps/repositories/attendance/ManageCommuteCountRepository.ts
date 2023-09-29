import Api from '../../commons/api';

import adapter from './../adapters';

export default {
  /**
   * Execute to update commute counts.
   */
  update: (param: {
    commuteForwardCount: number;
    commuteBackwardCount: number;
    targetDate?: string;
    employeeId?: string;
  }) => {
    return Api.invoke({
      path: '/att/daily-commute-count/save',
      param: adapter.toRemote({
        empId: param.employeeId,
        targetDate: param.targetDate,
        commuteForwardCount: param.commuteForwardCount,
        commuteBackwardCount: param.commuteBackwardCount,
      }),
    });
  },
};
