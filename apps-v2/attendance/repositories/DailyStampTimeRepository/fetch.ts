import Api from '@apps/commons/api';

import * as CommuteCount from '@attendance/repositories/models/CommuteCount';

import {
  ClockType,
  DailyStampTime as DomainDailyStampTime,
  IDailyStampTimeRepository,
} from '@attendance/domain/models/DailyStampTime';
import * as DomainFixDailyRequest from '@attendance/domain/models/FixDailyRequest';

/**
 * 指定した日付の勤怠明細が存在しない時、日毎通勤回数取得APIのレスポンスの通勤往路回数・通勤復路回数に入れられる数字
 */
export const NOT_HAVE_COMMUTE_COUNT = -1 as const;

type Response = {
  isEnableStartStamp: boolean;
  isEnableEndStamp: boolean;
  isEnableRestartStamp: boolean;
  stampInDate: string;
  stampOutDate: string;
  stampReInDate: string;
  defaultAction: ClockType | null | undefined;
  commuteForwardCount: number;
  commuteBackwardCount: number;
  isPossibleFixDailyRequest: boolean;
  record: {
    recordId: string;
    fixDailyRequest: {
      requestId: string;
      status: DomainFixDailyRequest.Status;
    };
  };
};

/**
 * 日毎通勤回数取得APIのレスポンスを見て、通勤回数が取得できているかどうかを返します
 */
const existRecordWithCommuteCount = (record: Response): boolean =>
  !(
    record.commuteForwardCount === NOT_HAVE_COMMUTE_COUNT &&
    record.commuteBackwardCount === NOT_HAVE_COMMUTE_COUNT
  );

const convert = (response: Response): DomainDailyStampTime => ({
  isEnableStartStamp: response.isEnableStartStamp,
  isEnableEndStamp: response.isEnableEndStamp,
  isEnableRestartStamp: response.isEnableRestartStamp,
  stampInDate: response.stampInDate,
  stampOutDate: response.stampOutDate,
  stampReInDate: response.stampReInDate,
  defaultAction: response.defaultAction,
  commuteCount: existRecordWithCommuteCount(response)
    ? CommuteCount.convert(response)
    : null,
  isPossibleFixDailyRequest: response.isPossibleFixDailyRequest,
  record: {
    id: response.record?.recordId || '',
    fixDailyRequest: {
      id: response.record?.fixDailyRequest?.requestId || '',
      status:
        response.record?.fixDailyRequest?.status ||
        DomainFixDailyRequest.STATUS.NOT_REQUESTED,
      approver01Name: '',
      performableActionForFix:
        DomainFixDailyRequest.detectPerformableActionForFix(
          response.record?.fixDailyRequest?.status ||
            DomainFixDailyRequest.STATUS.NOT_REQUESTED
        ),
    },
  },
});

export default ((employeeId = null) =>
  Api.invoke({
    path: '/att/daily-time/get',
    param: {
      empId: employeeId,
    },
  }).then((response: Response) =>
    convert(response)
  )) as IDailyStampTimeRepository['fetch'];
