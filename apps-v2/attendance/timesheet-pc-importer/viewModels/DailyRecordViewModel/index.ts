/**
 * 勤怠明細ViewModel
 *
 * これは ViewModel です。
 * State と Component、それを繋ぐ Container 以外では使用しないでください。
 */

import msg from '@commons/languages';
import DateUtil from '@commons/utils/DateUtil';

import { DayType } from '@apps/attendance/domain/models/AttDailyRecord';
import { EarlyLeaveReason } from '@attendance/domain/models/EarlyLeaveReason';
import { LateArrivalReason } from '@attendance/domain/models/LateArrivalReason';
import { Leave } from '@attendance/domain/models/Leave';
import { LeaveRange } from '@attendance/domain/models/LeaveRange';
import { RestTimeReason } from '@attendance/domain/models/RestTimeReason';
import { SubstituteLeaveType } from '@attendance/domain/models/SubstituteLeaveType';

export const MAX_MONTH = 1;

export type DailyRecordViewModel = {
  checked: boolean;
  dayType: DayType | null;
  recordId: string;
  recordDate: string;
  startTime: number | null;
  endTime: number | null;
  loadingRestTimeReasons: boolean;
  restTimeReasons: RestTimeReason[];
  rest1StartTime: number | null;
  rest1EndTime: number | null;
  rest1Reason: RestTimeReason;
  rest1ReasonCode: string;
  rest2StartTime: number | null;
  rest2EndTime: number | null;
  rest2Reason: RestTimeReason;
  rest2ReasonCode: string;

  // 休暇申請
  loadingLeaveRequestLeaves: boolean;
  leaveRequestLeaves: Leave[];
  appliedLeaveRequest1: boolean;
  leaveRequest1Leave: Leave;
  leaveRequest1Code: string;
  leaveRequest1Range: LeaveRange;
  leaveRequest1StartTime: number | null;
  leaveRequest1EndTime: number | null;
  leaveRequest1Reason: string;
  leaveRequest1Remark: string;

  // 残業申請
  appliedOvertimeWorkRequest: boolean;
  overtimeWorkRequestStartTime: number | null;
  overtimeWorkRequestEndTime: number | null;
  overtimeWorkRequestRemark: string;

  // 早朝勤務申請
  appliedEarlyStartWorkRequest: boolean;
  earlyStartWorkRequestStartTime: number | null;
  earlyStartWorkRequestEndTime: number | null;
  earlyStartWorkRequestRemark: string;

  // 遅刻申請
  loadingLateArrivalRequestReasons: boolean;
  lateArrivalReasons: LateArrivalReason[];
  appliedLateArrivalRequest: boolean;
  lateArrivalRequestReason: LateArrivalReason;
  lateArrivalRequestReasonText: string;
  lateArrivalRequestReasonCode: string;

  // 早退申請
  loadingEarlyLeaveRequestReasons: boolean;
  earlyLeaveReasons: EarlyLeaveReason[];
  appliedEarlyLeaveRequest: boolean;
  earlyLeaveRequestReason: EarlyLeaveReason;
  earlyLeaveRequestReasonText: string;
  earlyLeaveRequestReasonCode: string;

  // 欠勤申請
  appliedAbsenceRequest: boolean;
  absenceRequestReason: string;

  // 休日出勤申請
  appliedHolidayWorkRequest: boolean;
  holidayWorkRequestSubstituteLeaveType: SubstituteLeaveType;
  holidayWorkRequestStartTime: number | null;
  holidayWorkRequestEndTime: number | null;
  holidayWorkRequestRemark: string;

  // 画面でのエラー
  // path に対するエラーメッセージの配列になってます。
  validationErrors: Map<keyof DailyRecordViewModel, string[]>;

  // サーバーからのエラー
  serverErrors: string[];

  // 画面のエラーとサーバーからのエラーをマージしてた結果
  // ユーザは変更できない。
  errors: string[];

  // 備考
  comment: string;
};

export const create = (
  record?: Partial<DailyRecordViewModel>
): DailyRecordViewModel => ({
  checked: false,
  dayType: null,
  recordId: null,
  recordDate: null,
  startTime: null,
  endTime: null,
  loadingRestTimeReasons: false,
  restTimeReasons: null,
  rest1StartTime: null,
  rest1EndTime: null,
  rest1Reason: null,
  rest1ReasonCode: null,
  rest2StartTime: null,
  rest2EndTime: null,
  rest2Reason: null,
  rest2ReasonCode: null,
  loadingLeaveRequestLeaves: false,
  leaveRequestLeaves: null,
  appliedLeaveRequest1: false,
  leaveRequest1Leave: null,
  leaveRequest1Code: null,
  leaveRequest1Range: null,
  leaveRequest1StartTime: null,
  leaveRequest1EndTime: null,
  leaveRequest1Reason: null,
  leaveRequest1Remark: null,
  appliedOvertimeWorkRequest: false,
  overtimeWorkRequestStartTime: null,
  overtimeWorkRequestEndTime: null,
  overtimeWorkRequestRemark: null,
  appliedEarlyStartWorkRequest: false,
  earlyStartWorkRequestStartTime: null,
  earlyStartWorkRequestEndTime: null,
  earlyStartWorkRequestRemark: null,
  loadingLateArrivalRequestReasons: false,
  lateArrivalReasons: null,
  appliedLateArrivalRequest: false,
  lateArrivalRequestReason: null,
  lateArrivalRequestReasonCode: null,
  lateArrivalRequestReasonText: null,
  appliedEarlyLeaveRequest: false,
  loadingEarlyLeaveRequestReasons: false,
  earlyLeaveReasons: null,
  earlyLeaveRequestReason: null,
  earlyLeaveRequestReasonCode: null,
  earlyLeaveRequestReasonText: null,
  appliedAbsenceRequest: false,
  absenceRequestReason: null,
  appliedHolidayWorkRequest: false,
  holidayWorkRequestSubstituteLeaveType: null,
  holidayWorkRequestStartTime: null,
  holidayWorkRequestEndTime: null,
  holidayWorkRequestRemark: null,
  validationErrors: null,
  serverErrors: null,
  errors: [],
  comment: '',
  ...record,
});

export const isChecked = (record: DailyRecordViewModel) => record.checked;

export const hasError = (record: DailyRecordViewModel) =>
  !!record.errors?.length;

export const filterForSubmitting = (records: DailyRecordViewModel[]) =>
  records.filter((record) => isChecked(record) && !hasError(record));

export const hasErrors = (records: DailyRecordViewModel[]) =>
  records.filter(isChecked).some(hasError);

export const hasChecked = (records: DailyRecordViewModel[]) =>
  records.some(isChecked);

export const getCheckedStartEndTime = (
  records: DailyRecordViewModel[]
): {
  startDate: string;
  endDate: string;
} => {
  const $records = [...records].filter(isChecked);
  return {
    startDate: $records.at(0)?.recordDate || null,
    endDate: $records.at(-1)?.recordDate || null,
  };
};

export const getMaxDate = (date: string) =>
  DateUtil.formatISO8601Date(
    DateUtil.addDays(DateUtil.add(date, MAX_MONTH, 'month'), -1)
  );

export const isRequiredLoadingLeaveRequestLeaves = (
  record: DailyRecordViewModel
) =>
  record.appliedLeaveRequest1 &&
  record.leaveRequestLeaves === null &&
  !record.loadingLeaveRequestLeaves;

export const isRequiredLoadingEarlyLeaveRequestReasons = (
  record: DailyRecordViewModel
) =>
  record.appliedEarlyLeaveRequest &&
  record.earlyLeaveReasons === null &&
  !record.loadingEarlyLeaveRequestReasons;

export const isRequiredLoadingLateArrivalRequestReasons = (
  record: DailyRecordViewModel
) =>
  record.appliedLateArrivalRequest &&
  record.lateArrivalReasons === null &&
  !record.loadingLateArrivalRequestReasons;

export const isRequiredLoadingRestTimeReasons = (
  record: DailyRecordViewModel
) =>
  (record.rest1StartTime ??
    record.rest1EndTime ??
    record.rest2StartTime ??
    record.rest2EndTime ??
    null) !== null &&
  record.restTimeReasons === null &&
  !record.loadingRestTimeReasons;

export const getLabels = () =>
  ({
    startTime: msg().Att_Lbl_ImpHeaderStartTime,
    endTime: msg().Att_Lbl_ImpHeaderEndTime,
    rest1StartTime: msg().Att_Lbl_ImpHeaderRest1StartTime,
    rest1EndTime: msg().Att_Lbl_ImpHeaderRest1EndTime,
    rest1ReasonCode: msg().Att_Lbl_ImpHeaderRest1ReasonCode,
    rest2StartTime: msg().Att_Lbl_ImpHeaderRest2StartTime,
    rest2EndTime: msg().Att_Lbl_ImpHeaderRest2EndTime,
    rest2ReasonCode: msg().Att_Lbl_ImpHeaderRest2ReasonCode,
    appliedLeaveRequest1: msg().Att_Lbl_ImpHeaderAppliedLeaveRequest1,
    leaveRequest1Code: msg().Att_Lbl_ImpHeaderLeaveRequest1Code,
    leaveRequest1Range: msg().Att_Lbl_ImpHeaderLeaveRequest1Range,
    leaveRequest1StartTime: msg().Att_Lbl_ImpHeaderLeaveRequest1StartTime,
    leaveRequest1EndTime: msg().Att_Lbl_ImpHeaderLeaveRequest1EndTime,
    leaveRequest1Reason: msg().Att_Lbl_ImpHeaderLeaveRequest1Reason,
    leaveRequest1Remark: msg().Att_Lbl_ImpHeaderLeaveRequest1Remark,
    appliedOvertimeWorkRequest: msg().Att_Lbl_ImpHeaderAppliedOverworkRequest,
    overtimeWorkRequestStartTime:
      msg().Att_Lbl_ImpHeaderOverworkRequestStartTime,
    overtimeWorkRequestEndTime: msg().Att_Lbl_ImpHeaderOverworkRequestEndTime,
    overtimeWorkRequestRemark: msg().Att_Lbl_ImpHeaderOverworkRequestRemark,
    appliedEarlyStartWorkRequest:
      msg().Att_Lbl_ImpHeaderAppliedEarlyStartWorkRequest,
    earlyStartWorkRequestStartTime:
      msg().Att_Lbl_ImpHeaderEarlyStartWorkRequestStartTime,
    earlyStartWorkRequestEndTime:
      msg().Att_Lbl_ImpHeaderEarlyStartWorkRequestEndTime,
    earlyStartWorkRequestRemark:
      msg().Att_Lbl_ImpHeaderEarlyStartWorkRequestRemark,
    appliedLateArrivalRequest: msg().Att_Lbl_ImpHeaderAppliedLateArrivalRequest,
    lateArrivalRequestReasonText:
      msg().Att_Lbl_ImpHeaderLateArrivalRequestReason,
    lateArrivalRequestReasonCode:
      msg().Att_Lbl_ImpHeaderLateArrivalRequestReasonCode,
    appliedEarlyLeaveRequest: msg().Att_Lbl_ImpHeaderAppliedEarlyLeaveRequest,
    earlyLeaveRequestReasonText: msg().Att_Lbl_ImpHeaderEarlyLeaveRequestReason,
    earlyLeaveRequestReasonCode:
      msg().Att_Lbl_ImpHeaderEarlyLeaveRequestReasonCode,
    appliedHolidayWorkRequest: msg().Att_Lbl_ImpHeaderAppliedHolidayWorkRequest,
    holidayWorkRequestSubstituteLeaveType:
      msg().Att_Lbl_ImpHeaderHolidayWorkRequestSubstituteLeave,
    holidayWorkRequestStartTime:
      msg().Att_Lbl_ImpHeaderHolidayWorkRequestStartTime,
    holidayWorkRequestEndTime: msg().Att_Lbl_ImpHeaderHolidayWorkRequestEndTime,
    holidayWorkRequestRemark: msg().Att_Lbl_ImpHeaderHolidayWorkRequestRemark,
    errors: msg().Att_Lbl_ImpHeaderErrors,
  } as { [key in keyof DailyRecordViewModel]: string });

export const getLabel = (key: string): string => getLabels()[key] || '';
