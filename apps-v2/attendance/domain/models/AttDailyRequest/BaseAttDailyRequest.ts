import { compose } from '../../../../commons/utils/FnUtil';

// FIXME: 本来は、 model で repository の実態を呼び出すべきではないが、 createFromRemote が repository に移行するまでは許可することにする
import { DailyRest } from '@attendance/repositories/models/DailyRecord';
// FIXME: 本来は、 model で repository の実態を呼び出すべきではないが、 createFromRemote が repository に移行するまでは許可することにする
import { Timesheet as TimesheetFromRemote } from '@attendance/repositories/models/Timesheet';

import $STATUS from '@apps/domain/models/approval/request/Status';
import { RestTimeReason as DomainRestTimeReason } from '@attendance/domain/models/RestTimeReason';

import {
  CODE as REQUEST_TYPE_CODE,
  Code as AttDailyRequestTypeCode,
  DailyRequestNameMap,
} from '../AttDailyRequestType';
import { LeaveRange } from '../LeaveRange';
import { LeaveType } from '../LeaveType';
import * as RestTime from '../RestTime';
import { SubstituteLeaveType } from '../SubstituteLeaveType';
// FIXME: 本来は、model で service は呼び出すべきではないが、createDefaultValue が service に移行するまでは許可することにする
import getRequestTypeName from '@apps/attendance/domain/services/DailyRequestService/getRequestTypeName';
// FIXME: 本来は、model で factory は呼び出すべきではないが、createDefaultValue が service に移行するまでは許可することにする
import $createRestTimesFactory from '@attendance/domain/factories/RestTimesFactory';

const createRestTimesFactory = $createRestTimesFactory();

export const STATUS = {
  NOT_REQUESTED: $STATUS.NotRequested,
  RECALLED: $STATUS.Recalled,
  REJECTED: $STATUS.Rejected,
  APPROVAL_IN: $STATUS.ApprovalIn,
  APPROVED: $STATUS.Approved,
  CANCELED: $STATUS.Canceled,
  REAPPLYING: $STATUS.Reapplying,
} as const;

export type Status = Value<typeof STATUS>;

export type AttDailyRequestFromRemote = Readonly<{
  // 申請ID
  id: string;
  // 申請タイプコード
  requestTypeCode: AttDailyRequestTypeCode;
  // 申請ステータス
  status: Status;
  // 開始日(YYYY-MM-DD)
  startDate: string;
  // 終了日(YYYY-MM-DD)
  endDate: string;
  // 開始時刻
  startTime: number | null;
  // 終了時刻
  endTime: number | null;
  // 備考	最大255文字。
  remarks: string | null;
  // 理由 最大255文字。
  reason: string | null;
  // 休暇名
  leaveName: string | null;
  // 休暇コード
  leaveCode: string | null;
  // 休暇タイプ
  leaveType: LeaveType | null;
  // 休暇範囲
  leaveRange: LeaveRange | null;
  // 休暇内訳名
  leaveDetailName: string | null;
  // 休暇内訳コード
  leaveDetailCode: string | null;
  // 休日出勤取得休日タイプ
  substituteLeaveType: SubstituteLeaveType | null;
  // 振替休日取得日
  substituteDate: string | null;
  // 理由を求めるか否かフラグ
  requireReason: boolean;
  // 再申請元申請ID
  originalRequestId: string | null;
  // 承認内容変更申請中フラグ
  isForReapply: boolean;
  // 直行直帰申請休憩リスト
  directApplyRestList: DailyRest[];
  // 勤務パターンコード
  patternCode: string | null;
  // 勤務パターン名
  patternName: string | null;
  // 勤務時間変更申請の休憩開始時間1のデフォルト値
  patternApplyRest1StartTime: number | null;
  // 勤務時間変更申請の休憩終了時間1のデフォルト値
  patternApplyRest1EndTime: number | null;
  // 勤務時間変更申請の休憩開始時間2のデフォルト値
  patternApplyRest2StartTime: number | null;
  // 勤務時間変更申請の休憩終了時間2のデフォルト値
  patternApplyRest2EndTime: number | null;
  // 勤務時間変更申請の休憩開始時間3のデフォルト値
  patternApplyRest3StartTime: number | null;
  // 勤務時間変更申請の休憩終了時間3のデフォルト値
  patternApplyRest3EndTime: number | null;
  // 勤務時間変更申請の休憩開始時間4のデフォルト値
  patternApplyRest4StartTime: number | null;
  // 勤務時間変更申請の休憩終了時間4のデフォルト値
  patternApplyRest4EndTime: number | null;
  // 勤務時間変更申請の休憩開始時間5のデフォルト値
  patternApplyRest5StartTime: number | null;
  // 勤務時間変更申請の休憩終了時間2のデフォルト値
  patternApplyRest5EndTime: number | null;
  // 承認者01の名前
  approver01Name: string;
  // 自己都合
  personalReason: boolean;
  // 自責管理
  useManagePersonalReason: boolean;
  // 労働時間制
  workSystem: string;
  // フレックス開始時刻
  flexStartTime: number | null;
  // フレックス終了時刻
  flexEndTime: number | null;
  // コアタイムなし
  withoutCoreTime: boolean;
  // 勤務変更の日タイプ
  requestDayType: string;
  // 直接入力
  isDirectInputTimeRequest: boolean;
  // 遅刻早退理由D
  lateArrivalEarlyLeaveReasonId: string;
  // 遅刻早退理由名
  lateArrivalEarlyLeaveReasonName: string;
  // 遅刻早退理由コード
  lateArrivalEarlyLeaveReasonCode: string;
}>;

export type BaseAttDailyRequest = {
  // 申請ID
  id: string;
  // 申請タイプコード
  requestTypeCode: AttDailyRequestTypeCode;
  // 申請種別名
  requestTypeName: string;
  // 申請ステータス
  status: Status;
  // 開始日(YYYY-MM-DD)
  startDate: string;
  // 終了日(YYYY-MM-DD)
  endDate: string;
  // 開始時刻
  startTime: number | null;
  // 終了時刻
  endTime: number | null;
  // 備考	最大255文字。
  remarks: string;
  // 理由 最大255文字。
  reason: string;
  // 休暇コード
  leaveCode: string | null;
  // 休暇名
  leaveName: string | null;
  // 休暇タイプ
  leaveType: LeaveType | null;
  // 休暇範囲
  leaveRange: LeaveRange | null;
  // 休暇内訳名
  leaveDetailName: string | null;
  // 休暇内訳コード
  leaveDetailCode: string | null;
  // 休日出勤取得休日タイプ
  substituteLeaveType: SubstituteLeaveType | null;
  // 振替休日取得日
  substituteDate: string | null;
  // 直行直帰申請休憩
  directApplyRestTimes: RestTime.RestTimes;
  // 勤務パターンコード
  patternCode: string | null;
  // 勤務パターン名
  patternName: string | null;
  // 勤務時間変更申請休憩
  patternRestTimes: RestTime.RestTimes;
  // 再申請元申請ID
  originalRequestId: string | null;
  // 承認内容変更申請中フラグ
  isForReapply: boolean;
  // 理由を求めるか否かフラグ
  requireReason: boolean;
  // 承認者01の名前
  approver01Name: string;
  // 自己都合
  personalReason: boolean;
  // 自責管理
  useManagePersonalReason: boolean;
  // 労働時間制
  workSystem: string;
  // フレックス開始時刻
  flexStartTime: number | null;
  // フレックス終了時刻
  flexEndTime: number | null;
  // コアタイムなし
  withoutCoreTime: boolean;
  // 勤務変更の日タイプ
  requestDayType: string | null;
  // 申請可能な勤務変更の日タイプ
  requestableDayType: string | null;
  // 直接入力
  isDirectInputTimeRequest: boolean;
  // 申請可能な直接入力
  canDirectInputTimeRequest: boolean;
  // 遅刻早退理由ID
  reasonId: string;
  // 遅刻早退理由名
  reasonName: string;
  // 遅刻早退理由コード
  reasonCode: string;
  // 遅刻理由を管理するか否か
  useLateArrivalReason: boolean;
  // 早退理由を管理するか否か
  useEarlyLeaveReason: boolean;
};

export type IBaseAttDailyRequestFactory<T extends BaseAttDailyRequest> = {
  create: (...args: unknown[]) => T | Promise<T>;
};

const mapDirectApplyRestTime = (
  fromRemote: AttDailyRequestFromRemote
): {
  startTime: number;
  endTime: number;
  restReason: DomainRestTimeReason | null;
}[] =>
  (fromRemote.directApplyRestList || []).map((rest) => ({
    startTime: rest.restStartTime,
    endTime: rest.restEndTime,
    restReason: rest.restReason,
  }));

const createDirectApplyRestTimesFromRemote = (
  fromRemote: AttDailyRequestFromRemote
): RestTime.RestTimes => {
  const RestTimesFactory = createRestTimesFactory();
  return compose(
    RestTimesFactory.filter,
    RestTime.convertRestTimes,
    mapDirectApplyRestTime
  )(fromRemote);
};

const mapPatternRestTime = (
  fromRemote: AttDailyRequestFromRemote
): {
  startTime: any;
  endTime: any;
}[] => [
  {
    startTime: fromRemote.patternApplyRest1StartTime,
    endTime: fromRemote.patternApplyRest1EndTime,
  },
  {
    startTime: fromRemote.patternApplyRest2StartTime,
    endTime: fromRemote.patternApplyRest2EndTime,
  },
  {
    startTime: fromRemote.patternApplyRest3StartTime,
    endTime: fromRemote.patternApplyRest3EndTime,
  },
  {
    startTime: fromRemote.patternApplyRest4StartTime,
    endTime: fromRemote.patternApplyRest4EndTime,
  },
  {
    startTime: fromRemote.patternApplyRest5StartTime,
    endTime: fromRemote.patternApplyRest5EndTime,
  },
];

const createPatternRestTimesFromRemote = (
  fromRemote: AttDailyRequestFromRemote
): RestTime.RestTimes =>
  compose(RestTime.convertRestTimes, mapPatternRestTime)(fromRemote);

export const createFromRemote = (
  attRequestTypeMap: DailyRequestNameMap,
  paramFromRemote: AttDailyRequestFromRemote,
  timesheet: TimesheetFromRemote
): BaseAttDailyRequest => {
  const dailyRecord = timesheet.records.find(
    ({ recordDate }) => recordDate === paramFromRemote.startDate
  );
  const requestTypeName = getRequestTypeName(paramFromRemote.requestTypeCode, {
    nameMap: attRequestTypeMap,
    dailyRecord,
  });
  return {
    id: paramFromRemote.id,
    requestTypeCode: paramFromRemote.requestTypeCode,
    requestTypeName,
    status: paramFromRemote.status,
    startDate: paramFromRemote.startDate,
    endDate: paramFromRemote.endDate,
    startTime: paramFromRemote.startTime,
    endTime: paramFromRemote.endTime,
    remarks: paramFromRemote.remarks || '',
    reason: paramFromRemote.reason || '',
    leaveName: paramFromRemote.leaveName,
    leaveCode: paramFromRemote.leaveCode,
    leaveType: paramFromRemote.leaveType,
    leaveRange: paramFromRemote.leaveRange,
    leaveDetailCode: paramFromRemote.leaveDetailCode,
    leaveDetailName: paramFromRemote.leaveDetailName,
    substituteLeaveType: paramFromRemote.substituteLeaveType,
    substituteDate: paramFromRemote.substituteDate,
    directApplyRestTimes: createDirectApplyRestTimesFromRemote(paramFromRemote),
    patternCode: paramFromRemote.patternCode,
    patternName: paramFromRemote.patternName,
    patternRestTimes: createPatternRestTimesFromRemote(paramFromRemote),
    requireReason: paramFromRemote.requireReason,
    originalRequestId: paramFromRemote.originalRequestId,
    isForReapply: paramFromRemote.isForReapply,
    approver01Name: paramFromRemote.approver01Name,
    personalReason: paramFromRemote.personalReason,
    useManagePersonalReason: paramFromRemote.useManagePersonalReason,
    workSystem: paramFromRemote.workSystem,
    flexStartTime: paramFromRemote.flexStartTime,
    flexEndTime: paramFromRemote.flexEndTime,
    withoutCoreTime: paramFromRemote.withoutCoreTime,
    requestDayType: paramFromRemote.requestDayType,
    requestableDayType: null,
    isDirectInputTimeRequest: paramFromRemote.isDirectInputTimeRequest,
    canDirectInputTimeRequest: false,
    reasonId: paramFromRemote.lateArrivalEarlyLeaveReasonId,
    reasonName: paramFromRemote.lateArrivalEarlyLeaveReasonName,
    reasonCode: paramFromRemote.lateArrivalEarlyLeaveReasonCode,
    useLateArrivalReason: false,
    useEarlyLeaveReason: false,
  };
};

export const defaultValue: BaseAttDailyRequest = {
  id: '',
  requestTypeCode: REQUEST_TYPE_CODE.None,
  requestTypeName: '',
  status: STATUS.NOT_REQUESTED,
  startDate: '',
  endDate: '',
  startTime: null,
  endTime: null,
  remarks: '',
  reason: '',
  leaveName: '',
  leaveCode: '',
  leaveType: null,
  leaveRange: null,
  leaveDetailCode: null,
  leaveDetailName: null,
  substituteLeaveType: null,
  substituteDate: '',
  originalRequestId: '',
  isForReapply: false,
  directApplyRestTimes: [],
  patternCode: null,
  patternName: null,
  patternRestTimes: [],
  requireReason: false,
  approver01Name: '',
  personalReason: false,
  useManagePersonalReason: false,
  workSystem: '',
  flexStartTime: null,
  flexEndTime: null,
  withoutCoreTime: false,
  requestDayType: null,
  requestableDayType: null,
  isDirectInputTimeRequest: false,
  canDirectInputTimeRequest: false,
  reasonId: null,
  reasonName: null,
  reasonCode: null,
  useLateArrivalReason: false,
  useEarlyLeaveReason: false,
};

export const createFromDefaultValue = (
  attRequestTypeMap: DailyRequestNameMap,
  requestTypeCode: AttDailyRequestTypeCode,
  value: BaseAttDailyRequest = defaultValue
) => ({
  ...value,
  requestTypeCode: attRequestTypeMap[requestTypeCode].code,
  requestTypeName: attRequestTypeMap[requestTypeCode].name,
});
