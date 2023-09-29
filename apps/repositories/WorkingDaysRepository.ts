import Api from '../commons/api';

import adapter from './adapters';

export default {
  /**
   * Check to working days.
   */
  check: (empId?: string, targetDates?: Array<string>): Promise<any> =>
    Api.invoke({
      path: '/att/working-days/check',
      param: adapter.toRemote({
        empId,
        targetDates,
      }),
    }),
};
