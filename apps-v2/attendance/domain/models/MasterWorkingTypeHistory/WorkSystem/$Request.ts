import { LeaveRange } from '../../LeaveRange';
import { SubstituteLeaveType } from '../../SubstituteLeaveType';

/**
 * 早朝勤務申請
 */
export type $EarlyStartWorkRequest = {
  useEarlyStartWorkApply: boolean;

  /**
   * 申請した場合のみ勤務として認める
   */
  requireEarlyStartWorkApply: boolean;

  /**
   * 申請なしでも認める早朝勤務の開始時刻
   */
  requireEarlyStartWorkApplyBefore: number | null;
};

export const earlyStartWorkRequestDefaultValue: $EarlyStartWorkRequest = {
  useEarlyStartWorkApply: false,
  requireEarlyStartWorkApply: false,
  requireEarlyStartWorkApplyBefore: null,
};

/**
 * 残業申請
 */
export type $OvertimeWorkRequest = {
  useOvertimeWorkApply: boolean;

  /**
   * 申請した場合のみ勤務として認める
   */
  requireOvertimeWorkApply: boolean;

  /**
   * 申請なしでも認める残業の終了時刻
   */
  requireOvertimeWorkApplyAfter: number | null;
};

export const overtimeWorkRequestDefaultValue: $OvertimeWorkRequest = {
  useOvertimeWorkApply: false,
  requireOvertimeWorkApply: false,
  requireOvertimeWorkApplyAfter: null,
};

/**
 * 欠勤申請
 */
export type $AbsentRequest = {
  useAbsenceApply: boolean;
};

export const absentRequestDefaultValue: $AbsentRequest = {
  useAbsenceApply: false,
};

/**
 * 休暇申請
 */
export type $LeaveRequest = {
  /**
   * 休日出勤の代わりに許可される休日
   */
  useSubstituteLeaveTypes: SubstituteLeaveType[];
};

export const leaveRequestDefaultValue: $LeaveRequest = {
  useSubstituteLeaveTypes: [],
};

export type $LeaveRequestSubstituteLeave = {
  /**
   * 振替休日となる休暇種類
   */
  substituteLeaveCode: string[];
};

export const leaveRequestSubstituteLeaveDefaultValue = {
  substituteLeaveCode: [],
};

export type $LeaveRequestCompensatoryLeave = {
  /**
   * 全日分の代休付与
   */
  compensatoryLeaveThresholdAllDay: number | null;

  /**
   * 半日分の代休付与
   */
  useHalfDayCompensatoryLeaveGrant: boolean;
  compensatoryLeaveThresholdHalfDay: number | null;

  /**
   * 代休を申請できる範囲
   */
  compensatoryLeaveRanges: string;

  /**
   * 代休の有効期間
   */
  compensatoryLeaveValidPeriod: LeaveRange[];

  /**
   * 代休の事前取得
   */
  useCompensatoryLeavePreRequest: boolean;
  compensatoryLeavePreRequestDays: number | null;
};

export const leaveRequestCompensatoryLeaveRequestDefaultValue: $LeaveRequestCompensatoryLeave =
  {
    compensatoryLeaveThresholdAllDay: null,
    useHalfDayCompensatoryLeaveGrant: false,
    compensatoryLeaveThresholdHalfDay: null,
    compensatoryLeaveRanges: '',
    compensatoryLeaveValidPeriod: [],
    useCompensatoryLeavePreRequest: false,
    compensatoryLeavePreRequestDays: null,
  };

/**
 * 直行直帰申請
 */
export type $DirectApplyRequest = {
  useDirectApply: boolean;

  /**
   * 出退勤時刻(デフォルト)
   */
  directApplyStartTime: number | null;
  directApplyEndTime: number | null;

  /**
   * 休憩１(デフォルト)
   */
  directApplyRest1StartTime: number | null;
  directApplyRest1EndTime: number | null;

  /**
   * 休憩２(デフォルト)
   */
  directApplyRest2StartTime: number | null;
  directApplyRest2EndTime: number | null;

  /**
   * 休憩３(デフォルト)
   */
  directApplyRest3StartTime: number | null;
  directApplyRest3EndTime: number | null;

  /**
   * 休憩４(デフォルト)
   */
  directApplyRest4StartTime: number | null;
  directApplyRest4EndTime: number | null;

  /**
   * 休憩５(デフォルト)
   */
  directApplyRest5StartTime: number | null;
  directApplyRest5EndTime: number | null;
};

export const directApplyRequestDefaultValue: $DirectApplyRequest = {
  useDirectApply: false,
  directApplyStartTime: null,
  directApplyEndTime: null,
  directApplyRest1StartTime: null,
  directApplyRest1EndTime: null,
  directApplyRest2StartTime: null,
  directApplyRest2EndTime: null,
  directApplyRest3StartTime: null,
  directApplyRest3EndTime: null,
  directApplyRest4StartTime: null,
  directApplyRest4EndTime: null,
  directApplyRest5StartTime: null,
  directApplyRest5EndTime: null,
};

/**
 * 勤務時間変更申請
 */
export type $PatternApplyRequest = {
  usePatternApply: boolean;
};

export const patternApplyRequestDefaultValue: $PatternApplyRequest = {
  usePatternApply: false,
};
