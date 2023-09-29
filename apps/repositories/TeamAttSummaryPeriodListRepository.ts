import Api from '../commons/api';

import {
  AttSummaryPeriodList,
  AttSummaryPeriodListFromRemote,
  createFromRemote,
} from '../domain/models/team/AttSummaryPeriodList';

import adapter from './adapters';

export default {
  /**
   * Execute to get an timesheet
   *
   * @param targetPeriod - 対象月、対象月度での yyyymm。null の場合は今月が取得される。
   * @param empId - 社員Id。指定しない場合はログインユーザの社員Id。
   * {@link https://teamspiritdev.atlassian.net/wiki/spaces/GENIE/pages/894960041/team+att+summary-period+list}
   */
  fetch: (
    targetPeriod: string | null | undefined,
    empId?: string | null | undefined
  ): Promise<AttSummaryPeriodList> => {
    return Api.invoke({
      path: '/team/att/summary-period/list',
      param: adapter.toRemote({
        targetPeriod,
        empId,
      }),
    }).then((result: AttSummaryPeriodListFromRemote) => {
      return adapter.fromRemote({ ...result }, [createFromRemote]);
    });
  },
};
