import Api from '../../commons/api';

import { Code as RequestTypeCode } from '../../domain/models/attendance/AttDailyRequestType';
import {
  createFromRemote,
  Timesheet,
  TimesheetFromRemote,
} from '../../domain/models/attendance/Timesheet';

import adapter from '../adapters';

/**
 * Execute to get a timesheet (without converting into domain model)
 *
 * @param targetDate - 勤務表の取得対象日。YYYY-MM-DD形式の文字列。省略した場合は今日の日付。
 * @param empId - 社員Id。指定しない場合はログインユーザの社員Id。
 * {@link https://teamspiritdev.atlassian.net/wiki/spaces/GENIE/pages/11509595/att+timesheet+get}
 */
const fetchRaw = (
  targetDate: string | null | undefined = null,
  empId: string | null | undefined = null
): Promise<TimesheetFromRemote> => {
  return Api.invoke({
    path: '/att/timesheet/get',
    param: adapter.toRemote({
      targetDate,
      empId,
    }),
  });
};

export default {
  fetchRaw,

  /**
   * Execute to get a timesheet (and convert it into domain model)
   *
   * @param targetDate - 勤務表の取得対象日。YYYY-MM-DD形式の文字列。省略した場合は今日の日付。
   * @param empId - 社員Id。指定しない場合はログインユーザの社員Id。
   * {@link https://teamspiritdev.atlassian.net/wiki/spaces/GENIE/pages/11509595/att+timesheet+get}
   */
  fetch: (
    targetDate: string | null | undefined = null,
    empId: string | null | undefined = null
  ): Promise<Timesheet> => {
    return fetchRaw(targetDate, empId).then((result: TimesheetFromRemote) => {
      return adapter.fromRemote({ ...result }, [createFromRemote]);
    });
  },

  /**
   * Execute to get available Daily Request type code
   *
   * @param targetDate - 対象日。YYYY-MM-DD形式の文字列。省略した場合は今日の日付。
   * @param empId - 社員Id。指定しない場合はログインユーザの社員Id。
   * {@link https://teamspiritdev.atlassian.net/wiki/spaces/GENIE/pages/1689289811/att+daily-request+available+list}
   */
  fetchAvailableDailyRequest: (
    targetDate: string | null | undefined = null,
    empId: string | null | undefined = null
  ): Promise<{
    availableRequestTypeCodesMap: { [id: string]: Array<RequestTypeCode> };
  }> => {
    return Api.invoke({
      path: '/att/daily-request/available/list',
      param: {
        targetDate,
        empId,
      },
    });
  },
};
