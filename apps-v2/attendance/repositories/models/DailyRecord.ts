import { compose } from '@apps/commons/utils/FnUtil';

import * as CommuteCount from '@attendance/repositories/models/CommuteCount';

import * as DomainDailyRecord from '@attendance/domain/models/AttDailyRecord';
import { AttDailyRequest as DomainDailyRequest } from '@attendance/domain/models/AttDailyRequest';
import { Code } from '@attendance/domain/models/AttDailyRequestType';
import {
  createFromRemote as createFixDailyRequest,
  FixDailyRequest as DomainFixDailyRequest,
} from '@attendance/domain/models/FixDailyRequest';
import * as DomainRestTime from '@attendance/domain/models/RestTime';
import { RestTimeReason as DomainRestTimeReason } from '@attendance/domain/models/RestTimeReason';

import { Timesheet } from './Timesheet';
import $createRestTimesFactory from '@attendance/domain/factories/RestTimesFactory';
import * as DomainDailyRecordService from '@attendance/domain/services/DailyRecordService';

const createRestTimesFactory = $createRestTimesFactory();

export { DAY_TYPE } from '@attendance/domain/models/AttDailyRecord';

export type DailyRest = {
  restStartTime: number;
  restEndTime: number;
  restReason: DomainRestTimeReason | null;
};

type RestTimes = Readonly<{
  /* 休憩1開始時刻 */
  rest1StartTime: number | null;

  /* 休憩1終了時刻 */
  rest1EndTime: number | null;

  /* 休憩1休憩理由 */
  rest1Reason: DomainRestTimeReason | null;

  /* 休憩2開始時刻 */
  rest2StartTime: number | null;

  /* 休憩2終了時刻 */
  rest2EndTime: number | null;

  /* 休憩2休憩理由 */
  rest2Reason: DomainRestTimeReason | null;

  /* 休憩3開始時刻 */
  rest3StartTime: number | null;

  /* 休憩3終了時刻 */
  rest3EndTime: number | null;

  /* 休憩3休憩理由 */
  rest3Reason: DomainRestTimeReason | null;

  /* 休憩4開始時刻 */
  rest4StartTime: number | null;

  /* 休憩4終了時刻 */
  rest4EndTime: number | null;

  /* 休憩4休憩理由 */
  rest4Reason: DomainRestTimeReason | null;

  /* 休憩5開始時刻 */
  rest5StartTime: number | null;

  /* 休憩5終了時刻 */
  rest5EndTime: number | null;

  /* 休憩5休憩理由 */
  rest5Reason: DomainRestTimeReason | null;
}>;

export type DailyRecordContractedDetail = RestTimes &
  Readonly<{
    /* 出勤時刻 */
    startTime: number | null;

    /* 退勤時刻 */
    endTime: number | null;
  }>;

export type DailyRecord = Readonly<{
  /* 勤怠明細ID */
  id: string;

  /* 日付 */
  recordDate: string;

  /* 日タイプ */
  dayType: DomainDailyRecord.DayType;

  /* 出勤時刻 */
  startTime: number | null;

  /* 退勤時刻 */
  endTime: number | null;

  /* 出勤打刻時刻 */
  startStampTime: number | null;

  /* 退勤打刻時刻 */
  endStampTime: number | null;

  /* 休憩リスト */
  dailyRestList: DailyRest[];

  /* 申請可能な勤怠申請タイプコード一覧 */
  requestTypeCodes: Code[];

  /* 申請済みの勤怠申請ID一覧 */
  requestIds: string[];

  /* 勤怠所定情報 */
  contractedDetail: DailyRecordContractedDetail;

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

  /* その他の休憩の理由 */
  otherRestReason: DomainRestTimeReason | null;

  /* 通勤往路回数 */
  commuteForwardCount: number;

  /* 通勤復路回数 */
  commuteBackwardCount: number;

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

  /* 遅刻の自責管理 */
  useManageLateArrivalPersonalReason: boolean;

  /* 早退の自責管理 */
  useManageEarlyLeavePersonalReason: boolean;

  /* フレックス開始時刻 */
  flexStartTime: null | number;

  /* フレックス開始時刻 */
  flexEndTime: null | number;

  /* コアタイムなし */
  withoutCoreTime: boolean;

  /* 労働時間制 */
  workSystem: string;

  /* 日次勤務確定申請 */
  fixDailyRequest: DomainFixDailyRequest;

  /* 勤務変更の日タイプ */
  requestDayType: string | null;

  /* 直接入力 */
  isDirectInputTimeRequest: boolean;

  /* 日次勤務確定フラグ */
  isLocked: boolean;

  /* 法定休日フラグ */
  isHolLegalHoliday: boolean;

  /* 不足最低勤務時間 */
  outInsufficientMinimumWorkHours: null | number;

  /* 労働時間制がコアなしフレックスフラグ */
  isFlexWithoutCore: boolean;

  /* 早退時に申請を必須とするフラグ */
  isFlexWithoutCoreRequireEarlyLeaveApply: boolean;

  /* コアなしフレックス自責場合の早退の終了時刻 */
  personalReasonEarlyLeaveEndTime: null | number;

  /* コアなしフレックス他責場合の早退の終了時刻 */
  objectiveReasonEarlyLeaveEndTime: null | number;

  /* 遅刻早退理由 */
  lateArrivalEarlyLeaveReasonId: string;
}>;

const mapRestTime = (
  restTimes: RestTimes
): {
  startTime: unknown;
  endTime: unknown;
  restReason: unknown;
}[] => [
  {
    startTime: restTimes.rest1StartTime,
    endTime: restTimes.rest1EndTime,
    restReason: restTimes.rest1Reason,
  },
  {
    startTime: restTimes.rest2StartTime,
    endTime: restTimes.rest2EndTime,
    restReason: restTimes.rest2Reason,
  },
  {
    startTime: restTimes.rest3StartTime,
    endTime: restTimes.rest3EndTime,
    restReason: restTimes.rest3Reason,
  },
  {
    startTime: restTimes.rest4StartTime,
    endTime: restTimes.rest4EndTime,
    restReason: restTimes.rest4Reason,
  },
  {
    startTime: restTimes.rest5StartTime,
    endTime: restTimes.rest5EndTime,
    restReason: restTimes.rest5Reason,
  },
];

const createRestTimes = (restTimes: DailyRest[]): DomainRestTime.RestTimes => {
  const RestTimesFactory = createRestTimesFactory();
  const rests = restTimes.map(({ restStartTime, restEndTime, restReason }) => ({
    startTime: restStartTime,
    endTime: restEndTime,
    restReason,
  }));
  return compose(
    RestTimesFactory.filter,
    DomainRestTime.convertRestTimes
  )(rests);
};

const createContractRestTimes = (
  restTimes: RestTimes
): DomainRestTime.RestTimes => {
  const RestTimesFactory = createRestTimesFactory();
  return compose(
    RestTimesFactory.filter,
    DomainRestTime.convertRestTimes,
    mapRestTime
  )(restTimes);
};

export const createDailyContractDetail = (
  contractDetail: DailyRecordContractedDetail
) => ({
  startTime: contractDetail.startTime,
  endTime: contractDetail.endTime,
  restTimes: createContractRestTimes(contractDetail),
});

export const convert = (
  record: DailyRecord,
  timesheet: Timesheet,
  requests: { [id: string]: DomainDailyRequest }
): DomainDailyRecord.AttDailyRecord => {
  const locked = isLocked(record, timesheet);
  const requiredInput = isRequiredInput(record.recordDate, {
    records: timesheet.records,
    requests,
  });
  const editable = isEditable(record.recordDate, timesheet, requiredInput);

  return {
    id: record.id,
    recordDate: record.recordDate,
    dayType: record.dayType,
    startTime: record.startTime,
    endTime: record.endTime,
    startStampTime: record.startStampTime,
    endStampTime: record.endStampTime,
    restTimes: createRestTimes(record.dailyRestList),
    commuteCount: CommuteCount.convert(record),
    requestTypeCodes: record.requestTypeCodes,
    requestIds: record.requestIds,
    contractedDetail: createDailyContractDetail(record.contractedDetail),
    ciliTimePeriods: record.ciliTimePeriods,
    ciloTimePeriods: record.ciloTimePeriods,
    coliTimePeriods: record.coliTimePeriods,
    coloTimePeriods: record.coloTimePeriods,
    remarks: record.remarks || '',
    isLeaveOfAbsence: record.isLeaveOfAbsence,
    insufficientRestTime: record.insufficientRestTime,
    restHours: record.restHours,
    otherRestReason: record.otherRestReason,
    outStartTime: record.outStartTime,
    outEndTime: record.outEndTime,
    approver01Name: record.approver01Name,
    realWorkTime: record.realWorkTime,
    earlyStartWorkApplyDefaultEndTime: record.earlyStartWorkApplyDefaultEndTime,
    overtimeWorkApplyDefaultStartTime: record.overtimeWorkApplyDefaultStartTime,
    lateArrivalStartTime: record.lateArrivalStartTime,
    earlyLeaveEndTime: record.earlyLeaveEndTime,
    useManageLateArrivalPersonalReason:
      record.useManageLateArrivalPersonalReason,
    useManageEarlyLeavePersonalReason: record.useManageEarlyLeavePersonalReason,
    outInsufficientMinimumWorkHours:
      record.isFlexWithoutCoreRequireEarlyLeaveApply && record.isFlexWithoutCore
        ? record.outInsufficientMinimumWorkHours
        : 0,
    flexStartTime: record.flexStartTime,
    flexEndTime: record.flexEndTime,
    withoutCoreTime: record.withoutCoreTime,
    workSystem: record.workSystem,
    fixDailyRequest: createFixDailyRequest(record, timesheet.records),
    requestDayType: record.requestDayType,
    isLocked: locked,
    isHolLegalHoliday: record.isHolLegalHoliday,
    editable,
    requiredInput,
    isFlexWithoutCore: record.isFlexWithoutCore,
    isFlexWithoutCoreRequireEarlyLeaveApply:
      record.isFlexWithoutCoreRequireEarlyLeaveApply,
    personalReasonEarlyLeaveEndTime: record.personalReasonEarlyLeaveEndTime,
    objectiveReasonEarlyLeaveEndTime: record.objectiveReasonEarlyLeaveEndTime,
  };
};

/**
 * 勤怠明細がLockされているかを返します。
 */
const isLocked = (record: DailyRecord, timesheet: Timesheet) => {
  const workingType = timesheet.workingTypeList.find(
    ({ startDate, endDate }) =>
      startDate <= record.recordDate && record.recordDate <= endDate
  );
  return workingType?.useFixDailyRequest ? record.isLocked : false;
};

/**
 * 勤怠時間を入力するすべきかどうかを返します。
 * @param {*} targetDate
 * @param {*} timesheet
 */
export const isRequiredInput = (
  targetDate: string,
  {
    records,
    requests,
  }: {
    records: Timesheet['records'];
    requests: { [id: string]: DomainDailyRequest };
  }
): boolean => {
  const record = records.find((record) => record.recordDate === targetDate);
  if (!record) {
    return false;
  }
  const $requests = record.requestIds.map((k) => requests[k]);
  return DomainDailyRecordService.isRequiredInput({
    recordDate: record.recordDate,
    dayType: record.dayType,
    isLeaveOfAbsence: record.isLeaveOfAbsence,
    requests: $requests,
  });
};

/**
 * 勤怠時間が入力可能かどうかを返します。
 * @param {*} record
 * @param {*} isLocked
 * @param {*} requiredInput
 */
export const isEditable = <T extends Timesheet>(
  targetDate: string,
  timesheet: T,
  requiredInput: boolean
): boolean => {
  const record = timesheet.records.find(
    (record) => record.recordDate === targetDate
  );
  if (!record) {
    return false;
  }
  const { startTime, endTime } = record;
  return DomainDailyRecordService.isEditable({
    lockedTimesheet: timesheet.isLocked,
    lockedDailyRecord: isLocked(record, timesheet),
    startTime,
    endTime,
    requiredInput,
  });
};
