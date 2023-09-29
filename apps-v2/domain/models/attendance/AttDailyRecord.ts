/**
 * モバイル実装に合わせてモデルを作成しました。
 * 何れ PC 側もこちらの実装になる想定です。
 */
import { compose } from '../../../commons/utils/FnUtil';

import APP_REQUEST_STATUS from '../approval/request/Status';
import { AttDailyRequest } from './AttDailyRequest';
import { CODE as ATT_REQUEST_TYPE_CODE, Code } from './AttDailyRequestType';
import { LEAVE_RANGE } from './LeaveRange';
import * as RestTime from './RestTime';
import { getAttDailyRecordByDate, Timesheet } from './Timesheet';

export type DayType = 'Workday' | 'Holiday' | 'LegalHoliday';

// eslint-disable-next-line import/prefer-default-export
export const DAY_TYPE: {
  [key: string]: DayType;
} = {
  Workday: 'Workday',
  Holiday: 'Holiday',
  LegalHoliday: 'LegalHoliday',
};
export type AttDailyRecordContractedDetail = {
  /* 出勤時刻 */
  startTime: number | null;

  /* 退勤時刻 */
  endTime: number | null;

  /* 休憩時刻 */
  restTimes: RestTime.RestTimes;
};

/**
 * 日次備考
 */
export type DailyRemarks = {
  recordId: string;
  remarks: string;
};

export type AttDailyRecord = {
  /* 勤怠明細ID */
  id: string;

  /* 日付 */
  recordDate: string;

  /* 日タイプ */
  dayType: DayType;

  /* 出勤時刻 */
  startTime: number | null;

  /* 退勤時刻 */
  endTime: number | null;

  /* 出勤打刻時刻 */
  startStampTime: number | null;

  /* 退勤打刻時刻 */
  endStampTime: number | null;

  /* 休憩時刻 */
  restTimes: RestTime.RestTimes;

  /* 申請可能な勤怠申請タイプコード一覧 */
  requestTypeCodes: Code[];

  /* 申請済みの勤怠申請ID一覧 */
  requestIds: string[];

  /* 勤怠所定情報 */
  contractedDetail: any;

  /* 所定内法定内勤務時間帯 */
  ciliTimePeriods: { startTime: number; endTime: number }[];

  /* 所定内法定外勤務時間帯 */
  ciloTimePeriods: { startTime: number; endTime: number }[];

  /* 所定外法定内勤務時間帯 */
  coliTimePeriods: { startTime: number; endTime: number }[];

  /* 所定外法定外勤務時間帯 */
  coloTimePeriods: { startTime: number; endTime: number }[];

  /* 備考 */
  remarks: string;

  /* 休職休業中 */
  isLeaveOfAbsence: boolean;

  /* 不足休憩時間 */
  insufficientRestTime: number | null;

  /* その他の休憩時間 */
  restHours: number | null;

  /* 実効出勤時刻 */
  outStartTime: number | null;

  /* 実効退勤時刻 */
  outEndTime: number | null;

  /* 承認者01の名前 */
  approver01Name: string;

  /* 実労働時間 */
  realWorkTime: null | number;

  /* 早朝勤務申請デフォルト終了時刻 */
  earlyStartWorkApplyDefaultEndTime: null | number;

  /* 残業申請デフォルト開始時刻 */
  overtimeWorkApplyDefaultStartTime: null | number;

  /* 遅刻開始時間 */
  lateArrivalStartTime: null | number;

  /* 早退の終了時刻 */
  earlyLeaveEndTime: null | number;

  /* 往路を使用したか否か */
  commuteForwardCount: null | number;

  /* 復路を使用したか否か */
  commuteBackwardCount: null | number;
};

type RestTimesFromRemote = Readonly<{
  /* 休憩1開始時刻 */
  rest1StartTime: number | null;

  /* 休憩1終了時刻 */
  rest1EndTime: number | null;

  /* 休憩2開始時刻 */
  rest2StartTime: number | null;

  /* 休憩2終了時刻 */
  rest2EndTime: number | null;

  /* 休憩3開始時刻 */
  rest3StartTime: number | null;

  /* 休憩3終了時刻 */
  rest3EndTime: number | null;

  /* 休憩4開始時刻 */
  rest4StartTime: number | null;

  /* 休憩4終了時刻 */
  rest4EndTime: number | null;

  /* 休憩5開始時刻 */
  rest5StartTime: number | null;

  /* 休憩5終了時刻 */
  rest5EndTime: number | null;
}>;

export type AttDailyRecordContractedDetailFromRemote = RestTimesFromRemote &
  Readonly<{
    /* 出勤時刻 */
    startTime: number | null;

    /* 退勤時刻 */
    endTime: number | null;
  }>;

export type AttDailyRecordFromRemote = Readonly<
  RestTimesFromRemote & {
    /* 勤怠明細ID */
    id: string;

    /* 日付 */
    recordDate: string;

    /* 日タイプ */
    dayType: DayType;

    /* 出勤時刻 */
    startTime: number | null;

    /* 退勤時刻 */
    endTime: number | null;

    /* 出勤打刻時刻 */
    startStampTime: number | null;

    /* 退勤打刻時刻 */
    endStampTime: number | null;

    /* 申請可能な勤怠申請タイプコード一覧 */
    requestTypeCodes: Code[];

    /* 申請済みの勤怠申請ID一覧 */
    requestIds: string[];

    /* 勤怠所定情報 */
    contractedDetail: AttDailyRecordContractedDetailFromRemote;

    /* 所定内法定内勤務時間帯 */
    ciliTimePeriods: { startTime: number; endTime: number }[];

    /* 所定内法定外勤務時間帯 */
    ciloTimePeriods: { startTime: number; endTime: number }[];

    /* 所定外法定内勤務時間帯 */
    coliTimePeriods: { startTime: number; endTime: number }[];

    /* 所定外法定外勤務時間帯 */
    coloTimePeriods: { startTime: number; endTime: number }[];

    /* 備考 */
    remarks: string | null;

    /* 休職休業中 */
    isLeaveOfAbsence: boolean;

    /* 不足休憩時間 */
    insufficientRestTime: number | null;

    /* その他の休憩時間 */
    restHours: number | null;

    /* 実効出勤時刻 */
    outStartTime: number | null;

    /* 実効退勤時刻 */
    outEndTime: number | null;

    /* 承認者01の名前 */
    approver01Name: string;

    /* 実労働時間 */
    realWorkTime: null | number;

    /* 早朝勤務申請デフォルト終了時刻 */
    earlyStartWorkApplyDefaultEndTime: null | number;

    /* 残業申請デフォルト開始時刻 */
    overtimeWorkApplyDefaultStartTime: null | number;

    /* 遅刻開始時間 */
    lateArrivalStartTime: null | number;

    /* 早退の終了時刻 */
    earlyLeaveEndTime: null | number;

    /* 往路を使用したか否か */
    commuteForwardCount: null | number;

    /* 復路を使用したか否か */
    commuteBackwardCount: null | number;
  }
>;

const mapRestTime = (
  fromRemote: RestTimesFromRemote
): {
  startTime: any;
  endTime: any;
}[] => [
  {
    startTime: fromRemote.rest1StartTime,
    endTime: fromRemote.rest1EndTime,
  },
  {
    startTime: fromRemote.rest2StartTime,
    endTime: fromRemote.rest2EndTime,
  },
  {
    startTime: fromRemote.rest3StartTime,
    endTime: fromRemote.rest3EndTime,
  },
  {
    startTime: fromRemote.rest4StartTime,
    endTime: fromRemote.rest4EndTime,
  },
  {
    startTime: fromRemote.rest5StartTime,
    endTime: fromRemote.rest5EndTime,
  },
];

const createRestTimesFromRemote = (
  fromRemote: RestTimesFromRemote
): RestTime.RestTimes =>
  compose(RestTime.filter, RestTime.create, mapRestTime)(fromRemote);

export const createAttDailyContractDetailFromRemote = (
  fromRemote: AttDailyRecordContractedDetailFromRemote
) => ({
  startTime: fromRemote.startTime,
  endTime: fromRemote.endTime,
  restTimes: createRestTimesFromRemote(fromRemote),
});

export const createFromRemote = (
  fromRemote: AttDailyRecordFromRemote
): AttDailyRecord => ({
  id: fromRemote.id,
  recordDate: fromRemote.recordDate,
  dayType: fromRemote.dayType,
  startTime: fromRemote.startTime,
  endTime: fromRemote.endTime,
  startStampTime: fromRemote.startStampTime,
  endStampTime: fromRemote.endStampTime,
  restTimes: createRestTimesFromRemote(fromRemote),
  requestTypeCodes: fromRemote.requestTypeCodes,
  requestIds: fromRemote.requestIds,
  contractedDetail: createAttDailyContractDetailFromRemote(
    fromRemote.contractedDetail
  ),
  ciliTimePeriods: fromRemote.ciliTimePeriods,
  ciloTimePeriods: fromRemote.ciloTimePeriods,
  coliTimePeriods: fromRemote.coliTimePeriods,
  coloTimePeriods: fromRemote.coloTimePeriods,
  remarks: fromRemote.remarks || '',
  isLeaveOfAbsence: fromRemote.isLeaveOfAbsence,
  insufficientRestTime: fromRemote.insufficientRestTime,
  restHours: fromRemote.restHours,
  outStartTime: fromRemote.outStartTime,
  outEndTime: fromRemote.outEndTime,
  approver01Name: fromRemote.approver01Name,
  realWorkTime: fromRemote.realWorkTime,
  earlyStartWorkApplyDefaultEndTime:
    fromRemote.earlyStartWorkApplyDefaultEndTime,
  overtimeWorkApplyDefaultStartTime:
    fromRemote.overtimeWorkApplyDefaultStartTime,
  lateArrivalStartTime: fromRemote.lateArrivalStartTime,
  earlyLeaveEndTime: fromRemote.earlyLeaveEndTime,
  commuteForwardCount: fromRemote.commuteForwardCount,
  commuteBackwardCount: fromRemote.commuteBackwardCount,
});

/**
 * A より B が小さいことを確認します。
 * @param {*} a
 * @param {*} b
 * @return {*}
 */
function isLessThen(a: number | null, b: number | null): boolean {
  return a !== null && b !== null && a < b;
}

/**
 * 実効勤務時間に出退勤をしているかどうかを確認します。
 * @param {*} record
 * @return {*}
 */
export const isRealWorkingTimeOnEffectiveWorkingTime = (record: {
  startTime: number | null;
  endTime: number | null;
  outStartTime: number | null;
  outEndTime: number | null;
}): boolean => {
  const { outStartTime, outEndTime, startTime, endTime } = record;
  return (
    outStartTime === null ||
    outEndTime === null ||
    outStartTime - outEndTime !== 0 ||
    !isLessThen(startTime, endTime)
  );
};

/**
 * 実効勤務時間に出勤をしているかどうかを確認します。
 * @param {*} record
 * @return {*}
 */
export const isRealStartTimeOnEffectiveWorkingTime = (record: {
  startTime: number | null;
  outStartTime: number | null;
}): boolean => {
  const { startTime, outStartTime } = record;
  return !isLessThen(startTime, outStartTime);
};

/**
 * 実効勤務時間に退勤をしているかどうかを確認します。
 * @param {*} record
 * @return {*}
 */
export const isRealEndTimeOnEffectiveWorkingTime = (record: {
  endTime: number | null;
  outEndTime: number | null;
}): boolean => {
  const { endTime, outEndTime } = record;
  return !isLessThen(outEndTime, endTime);
};

/**
 * 不足休憩時間があるかを確認します。
 * @param {*} record
 * @return {*}
 */
export const hasInsufficientRestTime = (record: {
  insufficientRestTime: number | null;
}): boolean => {
  return !!record.insufficientRestTime;
};

/**
 * 申請を受け取り、働き方を変更すべき状態であるかを判定して、真偽を返却する
 * - 承認待ち、もしくは承認済みであれば、働き方を変えた前提の操作を提供する
 */
const hasStatusToChangeWorkingRule = (request: AttDailyRequest): boolean =>
  request.status === APP_REQUEST_STATUS.Approved ||
  request.status === APP_REQUEST_STATUS.ApprovalIn ||
  request.status === APP_REQUEST_STATUS.Recalled ||
  request.status === APP_REQUEST_STATUS.Rejected ||
  request.status === APP_REQUEST_STATUS.Canceled;

/**
 * 勤怠時間を入力するすべきかどうかを返します。
 * TODO: 何れエクスポートされなくなります。
 * @param {*} param.recordDate - Timesheet.recordsByRecordDate.{date}.recordDate
 * @param {*} param.dayType - Timesheet.recordsByRecordDate.{date}.dayType
 * @param {*} param.isLeaveOfAbsence - Timesheet.recordsByRecordDate.{date}.isLeaveOfAbsence
 * @param {*} requests
 */
export const shouldInputByParam = ({
  recordDate,
  dayType,
  isLeaveOfAbsence,
  requests,
}: {
  recordDate: string;
  dayType: string;
  isLeaveOfAbsence: boolean;
  // FIXME: 本来 Type を指定しなければなりませんが、
  // PC 側の処理と二重管理になるので、PC 側の型を受け入れられるように型を消しました。
  // PC 側のモデルが domain に移行できたら型指定をしてください。
  requests: AttDailyRequest[];
}): boolean => {
  // 休職・休業期間中の場合は、時刻操作を操作不可とする
  if (isLeaveOfAbsence) {
    const result = requests.some(
      (request) =>
        request.requestTypeCode === ATT_REQUEST_TYPE_CODE.Direct &&
        request.status === APP_REQUEST_STATUS.Approved
    );
    return result;
  }

  let result = false;
  switch (dayType) {
    case DAY_TYPE.Workday: {
      // 勤務日は、通常は時刻操作可能
      result = true;

      // ただし、以下の申請が承認待ちもしくは承認済みの場合は時刻操作を不可とする
      // ※却下・申請取消・承認取消であれば時刻操作可能
      // - 全日の休暇申請
      // - 振替休日ありの休日出勤申請（振替休日日）
      // - 欠勤申請
      requests.forEach((request) => {
        switch (request.requestTypeCode) {
          case ATT_REQUEST_TYPE_CODE.Leave:
            if (
              hasStatusToChangeWorkingRule(request) &&
              request.leaveRange === LEAVE_RANGE.Day
            ) {
              result = false;
            }

            break;

          case ATT_REQUEST_TYPE_CODE.HolidayWork:
            if (
              hasStatusToChangeWorkingRule(request) &&
              request.substituteDate === recordDate
            ) {
              result = false;
            }

            break;

          case ATT_REQUEST_TYPE_CODE.Absence:
            if (hasStatusToChangeWorkingRule(request)) {
              result = false;
            }

            break;

          case ATT_REQUEST_TYPE_CODE.Direct: {
            if (request.status === APP_REQUEST_STATUS.ApprovalIn) {
              result = false;
            }
            break;
          }
          default:
        }
      });

      break;
    }

    case DAY_TYPE.Holiday:
    case DAY_TYPE.LegalHoliday: {
      // 休日は、通常は時刻操作不可
      result = false;

      // ただし、有効な休日出勤申請があり、かつ振替元である場合は、時刻操作を可能とする
      requests.forEach((request) => {
        if (
          request.requestTypeCode === ATT_REQUEST_TYPE_CODE.HolidayWork &&
          request.status === APP_REQUEST_STATUS.Approved &&
          request.startDate === recordDate
        ) {
          result = true;
        }
      });
      break;
    }

    default:
  }
  return result;
};

/**
 * 勤怠時間を入力するすべきかどうかを返します。
 * @param {*} targetDate
 * @param {*} timesheet
 */
export const shouldInput = <T extends Timesheet>(
  targetDate: string,
  timesheet: T
): boolean => {
  const { requestsById } = timesheet;
  const record = getAttDailyRecordByDate(targetDate, timesheet);
  if (record === null) {
    return false;
  }
  const requests = record.requestIds.map((k) => requestsById[k]);
  return shouldInputByParam({
    recordDate: record.recordDate,
    dayType: record.dayType,
    isLeaveOfAbsence: record.isLeaveOfAbsence,
    requests,
  });
};

/**
 * 勤務時間が入力可能かどうかを返します
 * @param {*} param.isLocked - Timesheet.isLocked
 * @param {*} param.startTime - Timesheet.recordsByRecordDate.{date}.startTime
 * @param {*} param.endTime - Timesheet.recordsByRecordDate.{date}.endTime
 * @param {*} shouldInput - shouldInput
 */
const canEditByParam = ({
  isLocked,
  startTime,
  endTime,
  shouldInputResult,
}: {
  isLocked: boolean;
  startTime: number | null;
  endTime: number | null;
  shouldInputResult: boolean;
}) => {
  // Timesheet がロックされていたら操作不可とする
  if (isLocked) {
    return false;
  }
  // 勤務時刻をクリアするため、実労働時間を持つ場合は日タイプに関わらず操作可能とする
  if (startTime !== null || endTime !== null) {
    return true;
  }

  return shouldInputResult;
};

/**
 * 勤怠時間が入力可能かどうかを返します。
 * @param {*} record
 * @param {*} isLocked
 * @param {*} shouldInputResult
 */
export const canEdit = <T extends Timesheet>(
  targetDate: string,
  timesheet: T,
  shouldInputResult: boolean
): boolean => {
  const record = getAttDailyRecordByDate(targetDate, timesheet);
  if (record === null) {
    return false;
  }
  const { isLocked } = timesheet;
  const { startTime, endTime } = record;
  return canEditByParam({
    isLocked,
    startTime,
    endTime,
    shouldInputResult,
  });
};
