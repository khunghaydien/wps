import Api from '../../commons/api';

import {
  AttPattern,
  AttPatternFromRemote,
  createFromRemote,
} from '../../domain/models/attendance/AttPattern';

import adapter from '../adapters';

type Result = Readonly<{ patterns: AttPatternFromRemote[] }>;

export default {
  /**
   * Excute to search an AttDailyPattern
   */
  search: ({
    targetDate,
    ignoredId,
    empId,
  }: {
    targetDate: string;
    ignoredId?: string;
    empId?: string;
  }): Promise<AttPattern[]> => {
    return Api.invoke({
      path: '/att/daily-pattern/list',
      param: adapter.toRemote({
        targetDate,
        ignoredId: ignoredId || '',
        empId: empId || '',
      }),
    }).then((result: Result) =>
      result.patterns.map((r) =>
        adapter.fromRemote({ ...r }, [createFromRemote])
      )
    );
  },
};
