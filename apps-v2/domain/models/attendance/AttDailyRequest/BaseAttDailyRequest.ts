import { compose } from '../../../../commons/utils/FnUtil';

import STATUS, { Status } from '../../approval/request/Status';
import {
  AttDailyRequestType,
  CODE as REQUEST_TYPE_CODE,
  Code as AttDailyRequestTypeCode,
} from '../AttDailyRequestType';
import { LeaveRange } from '../LeaveRange';
import { LeaveType } from '../LeaveType';
import * as RestTime from '../RestTime';
import { SubstituteLeaveType } from '../SubstituteLeaveType';

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
  // 直行直帰申請休憩1開始時刻
  directApplyRest1StartTime: number | null;
  // 直行直帰申請休憩1終了時刻
  directApplyRest1EndTime: number | null;
  // 直行直帰申請休憩2開始時刻
  directApplyRest2StartTime: number | null;
  // 直行直帰申請休憩2終了時刻
  directApplyRest2EndTime: number | null;
  // 直行直帰申請休憩3開始時刻
  directApplyRest3StartTime: number | null;
  // 直行直帰申請休憩3終了時刻
  directApplyRest3EndTime: number | null;
  // 直行直帰申請休憩4開始時刻
  directApplyRest4StartTime: number | null;
  // 直行直帰申請休憩4終了時刻
  directApplyRest4EndTime: number | null;
  // 直行直帰申請休憩5開始時刻
  directApplyRest5StartTime: number | null;
  // 直行直帰申請休憩5終了時刻
  directApplyRest5EndTime: number | null;
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
};

const mapDirectApplyRestTime = (
  fromRemote: AttDailyRequestFromRemote
): {
  startTime: any;
  endTime: any;
}[] => [
  {
    startTime: fromRemote.directApplyRest1StartTime,
    endTime: fromRemote.directApplyRest1EndTime,
  },
  {
    startTime: fromRemote.directApplyRest2StartTime,
    endTime: fromRemote.directApplyRest2EndTime,
  },
  {
    startTime: fromRemote.directApplyRest3StartTime,
    endTime: fromRemote.directApplyRest3EndTime,
  },
  {
    startTime: fromRemote.directApplyRest4StartTime,
    endTime: fromRemote.directApplyRest4EndTime,
  },
  {
    startTime: fromRemote.directApplyRest5StartTime,
    endTime: fromRemote.directApplyRest5EndTime,
  },
];

const createDirectApplyRestTimesFromRemote = (
  fromRemote: AttDailyRequestFromRemote
): RestTime.RestTimes =>
  compose(RestTime.filter, RestTime.create, mapDirectApplyRestTime)(fromRemote);

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
  compose(RestTime.filter, RestTime.create, mapPatternRestTime)(fromRemote);

export const createFromRemote = (
  attRequestTypeMap: { [key in AttDailyRequestTypeCode]?: AttDailyRequestType },
  paramFromRemote: AttDailyRequestFromRemote
): BaseAttDailyRequest => ({
  id: paramFromRemote.id,
  requestTypeCode: paramFromRemote.requestTypeCode,
  requestTypeName: attRequestTypeMap[paramFromRemote.requestTypeCode].name,
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
});

export const defaultValue: BaseAttDailyRequest = {
  id: '',
  requestTypeCode: REQUEST_TYPE_CODE.None,
  requestTypeName: '',
  status: STATUS.NotRequested,
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
};

export const createFromDefaultValue = (
  attRequesTypeMap: {
    [key in AttDailyRequestTypeCode]?: AttDailyRequestType;
  },
  requestTypeCode: AttDailyRequestTypeCode,
  value: BaseAttDailyRequest = defaultValue
) => ({
  ...value,
  requestTypeCode: attRequesTypeMap[requestTypeCode].code,
  requestTypeName: attRequesTypeMap[requestTypeCode].name,
});
