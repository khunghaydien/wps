/**
 * 勤怠サマリー
 */

import { AttDailyAttention } from '@attendance/domain/models/AttDailyAttention';

import { DayType } from './AttDailyRecord';
import { CommuteState } from './CommuteCount';
import { OwnerInfo } from './OwnerInfo';

export { type OwnerInfo };

export const SUMMARY_NAME = {
  DAYS_SUMMARY: 'DaysSummary',
  WORK_TIME_SUMMARY: 'WorkTimeSummary',
  AGREEMENT_SUMMARY: 'AgreementSummary',
  LEGAL_OVER_SUMMARY: 'LegalOverSummary',
  COMMUTE_COUNT_SUMMARY: 'CommuteCountSummary',
  OVER_TIME_SUMMARY1: 'OverTimeSummary1',
  OVER_TIME_SUMMARY2: 'OverTimeSummary2',
  LOST_TIME_SUMMARY: 'LostTimeSummary',
  LEAVE_SUMMARY: 'LeaveSummary',
  ANNUAL_PAID_LEAVE_SUMMARY: 'AnnualPaidLeaveSummary',
  GENERAL_PAID_LEAVE_SUMMARY: 'GeneralPaidLeaveSummary',
  UNPAID_LEAVE_SUMMARY: 'UnpaidLeaveSummary',
  ABSENCE_SUMMARY: 'AbsenceSummary',
  ANNUAL_PAID_LEAVE_LEFT_SUMMARY: 'AnnualPaidLeaveLeftSummary',
} as const;

export type SummaryName = Value<typeof SUMMARY_NAME>;

const NAMES_GENERAL = {
  CONTRACTUAL_WORK_DAYS: 'ContractualWorkDays',
  REAL_WORK_DAYS: 'RealWorkDays',
  COMMUTE_COUNT: 'CommuteCount',
  LEGAL_HOLIDAY_WORK_COUNT: 'LegalHolidayWorkCount',
  HOLIDAY_WORK_COUNT: 'HolidayWorkCount',
  CONTRACTED_WORK_HOURS: 'ContractedWorkHours',
  REAL_WORK_TIME: 'RealWorkTime',
  DIFFERENCE_TIME: 'DifferenceTime',
  PLAIN_TIME: 'PlainTime',
  VIRTUAL_WORK_TIME: 'VirtualWorkTime',
  WHOLE_LEGAL_WORK_TIME: 'WholeLegalWorkTime',
  LEGAL_WORK_HOURS: 'LegalWorkHours',
  LEGAL_OVER_TIME: 'LegalOverTime',
  QUARTER_LEGAL_OVER_TIME: 'QuarterLegalOverTime',
  YEAR_LEGAL_OVER_TIME: 'YearLegalOverTime',
  YEAR_LEGAL_OVER_COUNT: 'YearLegalOverCount',
  OUT_AGREEMENT_MONTHLY_OVERTIME: 'OutAgreementMonthlyOvertime',
  OUT_AGREEMENT_SPECIAL_MONTHLY_OVERTIME: 'OutAgreementSpecialMonthlyOvertime',
  OUT_AGREEMENT_YEARLY_OVERTIME: 'OutAgreementYearlyOvertimeTotal',
  OUT_AGREEMENT_SPECIAL_YEARLY_OVERTIME:
    'OutAgreementSpecialYearlyOvertimeTotal',
  SAFETY_OBLIGATIONAL_EXCESS_TIME: 'SafetyObligationalExcessTime',
  WORK_TIME01: 'WorkTime01',
  WORK_TIME02: 'WorkTime02',
  WORK_TIME03: 'WorkTime03',
  WORK_TIME04: 'WorkTime04',
  WORK_TIME05: 'WorkTime05',
  WORK_TIME06: 'WorkTime06',
  WORK_TIME07: 'WorkTime07',
  COMPENSATORY_LEAVE_EXPIRED_TIME: 'CompensatoryLeaveExpiredTime',
  LATE_ARRIVE_COUNT: 'LateArriveCount',
  LATE_ARRIVE_TIME: 'LateArriveTime',
  LATE_ARRIVE_LOST_TIME: 'LateArriveLostTime',
  EARLY_LEAVE_COUNT: 'EarlyLeaveCount',
  EARLY_LEAVE_TIME: 'EarlyLeaveTime',
  EARLY_LEAVE_LOST_TIME: 'EarlyLeaveLostTime',
  BREAK_LOST_COUNT: 'BreakLostCount',
  BREAK_TIME: 'BreakTime',
  BREAK_LOST_TIME: 'BreakLostTime',
  LEAVE_LOST_TIME: 'LeaveLostTime',
  SHORTENED_WORK_TIME: 'ShortenedWorkTime',
  WORK_ABSENCE_DAYS: 'WorkAbsenceDays',
  ANNUAL_PAID_LEAVE_DAYS_LEFT: 'AnnualPaidLeaveDaysLeft',
} as const;

export const SUMMARY_ITEM_NAME = {
  ...NAMES_GENERAL,
  ANNUAL_PAID_LEAVE_DAYS: 'AnnualPaidLeaveDays',
  GENERAL_PAID_LEAVE_DAYS: 'GeneralPaidLeaveDays',
  UNPAID_LEAVE_DAYS: 'UnpaidLeaveDays',
} as const;

export type SummaryItemName = Value<typeof SUMMARY_ITEM_NAME>;

export const UNIT = {
  DAYS: 'days',
  HOURS: 'hours',
  COUNT: 'count',
  DAYS_AND_HOURS: 'daysAndHours',
} as const;

export type Unit = typeof UNIT[keyof typeof UNIT];

export type DailyRecord = {
  recordDate: string;
  dayType: DayType;
  event: string | null;
  shift: string | null;
  commuteState?: CommuteState | null;
  dailyObjectiveEventLog: string | null;
  allowanceDailyRecordCount: number | null;
  startTime: number | null;
  endTime: number | null;
  startStampTime: number | null;
  endStampTime: number | null;
  outStartTime: number | null;
  outEndTime: number | null;
  insufficientRestTime: number | null;
  virtualWorkTime: number | null;
  restTime: number | null;
  realWorkTime: number | null;
  holidayWorkTime: number | null;
  overTime: number | null;
  nightTime: number | null;
  lostTime: number | null;
  remarks: string;
  attentions: AttDailyAttention[];
  startTimeModified: boolean;
  endTimeModified: boolean;
  isHolLegalHoliday: boolean;
};

export type DaysAndHours = {
  days: number;
  hours?: number;
  unit?: string;
};

export type BaseSummaryItem<T = string> = {
  name: T;
  value: string | number | null;
  daysAndHours?: DaysAndHours;
  unit?: Unit;
};

export type GeneralSummaryItem = BaseSummaryItem<
  typeof NAMES_GENERAL[keyof typeof NAMES_GENERAL]
>;

export type AnnualPaidLeaveDaysSummaryItem = BaseSummaryItem<
  typeof SUMMARY_ITEM_NAME.ANNUAL_PAID_LEAVE_DAYS
> & { closingDate: string };

export type LeaveDaysSummaryItem = BaseSummaryItem<
  | typeof SUMMARY_ITEM_NAME.GENERAL_PAID_LEAVE_DAYS
  | typeof SUMMARY_ITEM_NAME.UNPAID_LEAVE_DAYS
> & {
  items: BaseSummaryItem[];
};

export type SummaryItem =
  | GeneralSummaryItem
  | AnnualPaidLeaveDaysSummaryItem
  | LeaveDaysSummaryItem;

export type Summary = {
  name: SummaryName;
  items: SummaryItem[];
};

export type DividedSummary = {
  name: string;
  startDate: string;
  endDate: string;
  summaries: Summary[];
};

export type DailyRecordTotal = {
  restTime: number;
  realWorkTime: number;
  overTime: number;
  nightTime: number;
  lostTime: number;
  virtualWorkTime: number;
  holidayWorkTime: number;
};

export type BaseAttendanceSummary = {
  ownerInfos: OwnerInfo[];
  startDate: string;
  endDate: string;
  records: DailyRecord[];
  recordTotal: DailyRecordTotal;
  summaries: Summary[];
  dividedSummaries: DividedSummary[];
  attention: {
    ineffectiveWorkingTime: number;
    insufficientRestTime: number;
  };
  workingType: {
    useManageCommuteCount: boolean;
    useAllowanceManagement: boolean;
    useObjectivelyEventLog: boolean;
    useRestReason: boolean;
  };
};
