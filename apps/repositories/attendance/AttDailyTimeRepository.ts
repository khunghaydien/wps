import Api from '../../commons/api';

import { AttDailyTimeForRemoteUpdate } from '../../domain/models/attendance/AttDailyTime';

import adapter from '../adapters';

export type UpdateResult = {
  insufficientRestTime: number | null | undefined;
};

export default {
  /**
   * Excute to create an AttDailyTime
   */
  update: (
    targetDate: string,
    entity: AttDailyTimeForRemoteUpdate
  ): Promise<UpdateResult> => {
    return Api.invoke({
      path: '/att/daily-time/save',
      param: adapter.toRemote({
        targetDate,
        ...entity,
      }),
    });
  },
};
