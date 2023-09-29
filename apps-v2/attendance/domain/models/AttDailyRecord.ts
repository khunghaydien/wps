/**
 * モバイル実装に合わせてモデルを作成しました。
 * 何れ PC 側もこちらの実装になる想定です。
 */

import { DynamicTestConditions } from '@apps/domain/models/access-control/Permission';

import { Code } from './AttDailyRequestType';
import { CommuteCount } from './CommuteCount';
import { FixDailyRequest } from './FixDailyRequest';
import * as RestTime from './RestTime';
import { RestTimeReason } from './RestTimeReason';

// eslint-disable-next-line import/prefer-default-export
export const DAY_TYPE = {
  Workday: 'Workday',
  Holiday: 'Holiday',
  LegalHoliday: 'LegalHoliday',
  PreferredLegalHoliday: 'PreferredLegalHoliday',
} as const;

export type DayType = typeof DAY_TYPE[keyof typeof DAY_TYPE];

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

/**
 * 日次明細の内ユーザーが入力可能で勤務時間に関わるもの
 */
export type DailyAttendanceTime = {
  employeeId?: string;
  recordId: string;
  recordDate: string;
  startTime: number | null;
  endTime: number | null;
  restTimes: RestTime.RestTimes;
  restHours: number | null;
  otherRestReason: RestTimeReason | null;
  commuteCount: CommuteCount;
  remarks: string | null;
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

  /* 通勤回数 */
  commuteCount: CommuteCount;

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

  /* その他の休憩理由 */
  otherRestReason: RestTimeReason | null;

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

  /* フレックス終了時刻 */
  flexEndTime: null | number;

  /* コアタイムなし */
  withoutCoreTime: boolean;

  /* 労働時間制 */
  workSystem: string;

  /* 日次勤務確定申請 */
  fixDailyRequest: FixDailyRequest;

  /* 勤務変更の日タイプ */
  requestDayType: string | null;

  /* 日次勤務確定フラグ */
  isLocked: boolean;

  /* 法定休日フラグ */
  isHolLegalHoliday: boolean;

  /* 入力必須か否か */
  requiredInput: boolean;

  /* 入力可能か否か */
  editable: boolean;

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
};

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
    // 実行勤務時間がないということは出退勤していないため対象外で true とする
    // 以下は存在しない
    // startTime === null && outStartTime >= 0
    // endTime === null && endStartTime >= 0
    outStartTime === null ||
    outEndTime === null ||
    // FIXME:
    // 実行勤務時間が存在する（0秒以上の差がある）のに勤務時間入力がある場合を false したかったのだが、
    // 一見ではわからない状態なので修正が必要である。
    // もともと書いた判定式は下記であり「勤務時間外で働いていること（7-9 で働いて 9 ~ が就業時刻だった場合、outStartTime = 9, outEndTime = 9 になる）」だったので逆にした際に歪みが生じてしまった。
    //   outStartTime - outEndTime === 0 && isLessThen(startTime, endTime)
    // isLessThen も運用上 endTime < startTime がありえないことを想定して startTime !== null && endTime !== null を使っている状態で良い書き方ではない。
    // 以下のように修正するのが望ましい
    //   outStartTime === outEndTime  && startTime !== null && endTime !== null
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
 * 不足最低勤務時間があるかを確認します。
 * @param {*} record
 * @return {*}
 */
export const hasOutInsufficientMinimumWorkHours = (record: {
  outInsufficientMinimumWorkHours: number | null;
}): boolean => {
  return !!record.outInsufficientMinimumWorkHours;
};

export const getPermissionTestConditionsForEdit =
  (): DynamicTestConditions | void => {
    return {
      allowIfByEmployee: true,
      requireIfByDelegate: ['editAttTimeSheetByDelegate'],
    };
  };

export type IDailyRecordRepository = {
  save: (
    entity: Omit<DailyAttendanceTime, 'recordId'>
  ) => Promise<{ insufficientRestTime: number | null | undefined }>;
  saveRemarks: (parameters: DailyRemarks) => Promise<void>;
  saveFields: (param: {
    recordId: string;
    values: {
      objectName: string;
      objectItemName: string;
      value: string;
    }[];
  }) => Promise<void>;
  fillRestTime: (param?: {
    targetDate?: string;
    employeeId?: string;
  }) => Promise<void>;
};
