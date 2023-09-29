import msg from '@apps/commons/languages';
import DateUtil from '@apps/commons/utils/DateUtil';
import DurationUtil from '@apps/commons/utils/DurationUtil';
import TextUtil from '@apps/commons/utils/TextUtil';
import TimeUtil from '@apps/commons/utils/TimeUtil';

import {
  DaysAndHours,
  SUMMARY_ITEM_NAME,
} from '@attendance/domain/models/BaseAttendanceSummary';

const messageIdByItemNameTranslations: {
  [name: string]: keyof ReturnType<typeof msg>;
} = {
  [SUMMARY_ITEM_NAME.CONTRACTUAL_WORK_DAYS]: 'Att_Lbl_ContractualWorkDays',
  [SUMMARY_ITEM_NAME.REAL_WORK_DAYS]: 'Att_Lbl_RealWorkDays',
  [SUMMARY_ITEM_NAME.COMMUTE_COUNT]: 'Att_Lbl_CommuteCount',
  [SUMMARY_ITEM_NAME.LEGAL_HOLIDAY_WORK_COUNT]: 'Att_Lbl_LegalHolidayWorkCount',
  [SUMMARY_ITEM_NAME.HOLIDAY_WORK_COUNT]: 'Att_Lbl_HolidayWorkCount',
  [SUMMARY_ITEM_NAME.CONTRACTED_WORK_HOURS]: 'Att_Lbl_ContractedWorkHours',
  [SUMMARY_ITEM_NAME.REAL_WORK_TIME]: 'Att_Lbl_RealWorkTime',
  [SUMMARY_ITEM_NAME.DIFFERENCE_TIME]: 'Att_Lbl_DifferenceTime',
  [SUMMARY_ITEM_NAME.PLAIN_TIME]: 'Att_Lbl_PlainTime',
  [SUMMARY_ITEM_NAME.VIRTUAL_WORK_TIME]: 'Att_Lbl_VirtualWorkTime',
  [SUMMARY_ITEM_NAME.WHOLE_LEGAL_WORK_TIME]: 'Att_Lbl_WholeLegalWorkTime',
  [SUMMARY_ITEM_NAME.LEGAL_WORK_HOURS]: 'Att_Lbl_LegalWorkHours',
  [SUMMARY_ITEM_NAME.LEGAL_OVER_TIME]: 'Att_Lbl_LegalOverTime',
  [SUMMARY_ITEM_NAME.QUARTER_LEGAL_OVER_TIME]: 'Att_Lbl_QuarterLegalOverTime',
  [SUMMARY_ITEM_NAME.YEAR_LEGAL_OVER_TIME]: 'Att_Lbl_YearLegalOverTime',
  [SUMMARY_ITEM_NAME.YEAR_LEGAL_OVER_COUNT]: 'Att_Lbl_YearLegalOverCount',
  [SUMMARY_ITEM_NAME.OUT_AGREEMENT_MONTHLY_OVERTIME]:
    'Att_Lbl_OutAgreementMonthlyOvertime',
  [SUMMARY_ITEM_NAME.OUT_AGREEMENT_SPECIAL_MONTHLY_OVERTIME]:
    'Att_Lbl_OutAgreementSpecialMonthlyOvertime',
  [SUMMARY_ITEM_NAME.OUT_AGREEMENT_YEARLY_OVERTIME]:
    'Att_Lbl_OutAgreementYearlyOvertimeTotal',
  [SUMMARY_ITEM_NAME.OUT_AGREEMENT_SPECIAL_YEARLY_OVERTIME]:
    'Att_Lbl_OutAgreementSpecialYearlyOvertimeTotal',
  [SUMMARY_ITEM_NAME.SAFETY_OBLIGATIONAL_EXCESS_TIME]:
    'Att_Lbl_SafetyObligationalExcessTime',
  [SUMMARY_ITEM_NAME.WORK_TIME01]: 'Att_Lbl_OutWorkTime01',
  [SUMMARY_ITEM_NAME.WORK_TIME02]: 'Att_Lbl_OutWorkTime02',
  [SUMMARY_ITEM_NAME.WORK_TIME03]: 'Att_Lbl_OutWorkTime03',
  [SUMMARY_ITEM_NAME.WORK_TIME04]: 'Att_Lbl_OutWorkTime04',
  [SUMMARY_ITEM_NAME.WORK_TIME05]: 'Att_Lbl_OutWorkTime05',
  [SUMMARY_ITEM_NAME.WORK_TIME06]: 'Att_Lbl_OutWorkTime06',
  [SUMMARY_ITEM_NAME.WORK_TIME07]: 'Att_Lbl_OutWorkTime07',
  [SUMMARY_ITEM_NAME.COMPENSATORY_LEAVE_EXPIRED_TIME]:
    'Att_Lbl_CompensatoryLeaveExpiredTime',
  [SUMMARY_ITEM_NAME.LATE_ARRIVE_COUNT]: 'Att_Lbl_LateArriveCount',
  [SUMMARY_ITEM_NAME.LATE_ARRIVE_TIME]: 'Att_Lbl_LateArriveTime',
  [SUMMARY_ITEM_NAME.LATE_ARRIVE_LOST_TIME]: 'Att_Lbl_LateArriveLostTime',
  [SUMMARY_ITEM_NAME.EARLY_LEAVE_COUNT]: 'Att_Lbl_EarlyLeaveCount',
  [SUMMARY_ITEM_NAME.EARLY_LEAVE_TIME]: 'Att_Lbl_EarlyLeaveTime',
  [SUMMARY_ITEM_NAME.EARLY_LEAVE_LOST_TIME]: 'Att_Lbl_EarlyLeaveLostTime',
  [SUMMARY_ITEM_NAME.BREAK_LOST_COUNT]: 'Att_Lbl_BreakLostCount',
  [SUMMARY_ITEM_NAME.BREAK_TIME]: 'Att_Lbl_BreakTime',
  [SUMMARY_ITEM_NAME.BREAK_LOST_TIME]: 'Att_Lbl_BreakLostTime',
  [SUMMARY_ITEM_NAME.LEAVE_LOST_TIME]: 'Att_Lbl_LeaveLostTime',
  [SUMMARY_ITEM_NAME.SHORTENED_WORK_TIME]: 'Att_Lbl_ShortenedWorkTime',
  [SUMMARY_ITEM_NAME.ANNUAL_PAID_LEAVE_DAYS]: 'Att_Lbl_AnnualPaidLeaveDays',
  [SUMMARY_ITEM_NAME.GENERAL_PAID_LEAVE_DAYS]: 'Att_Lbl_GeneralPaidLeaveDays',
  [SUMMARY_ITEM_NAME.UNPAID_LEAVE_DAYS]: 'Att_Lbl_UnpaidLeaveDays',
  [SUMMARY_ITEM_NAME.WORK_ABSENCE_DAYS]: 'Att_Lbl_WorkAbsenceDays',
  [SUMMARY_ITEM_NAME.ANNUAL_PAID_LEAVE_DAYS_LEFT]:
    'Att_Lbl_AnnualPaidLeaveDaysLeft',
} as const;

export const label = (name: string): string => {
  const msgId = messageIdByItemNameTranslations[name];
  return msgId ? msg()[msgId] || '' : '';
};

export const value = ({
  name,
  unit,
  value,
  daysAndHours,
}: {
  value: string | number;
  unit?: string;
  daysAndHours?: DaysAndHours;
  name?: string;
}): string | number => {
  if (name === SUMMARY_ITEM_NAME.DIFFERENCE_TIME) {
    if (typeof value === 'number') {
      return DurationUtil.toHHmm(value, true);
    }
  }

  switch (unit) {
    case 'days':
      return DateUtil.formatDaysWithUnit(Number(value));
    case 'hours':
      return TimeUtil.toHHmm(value);
    case 'count':
      return `${value || 0} ${msg().Com_Lbl_Times}`;
    case 'daysAndHours':
      return DurationUtil.formatDaysAndHoursWithUnit(
        daysAndHours.days,
        daysAndHours.hours
      );
    default:
  }

  // This line should not be evaluated
  return value;
};

export const closingDate = (date: string): string => {
  if (!date) {
    return null;
  }

  const dateStr = TextUtil.template(
    msg().Com_Lbl_AsAt,
    DateUtil.formatYMD(date)
  );

  return TextUtil.template(msg().Com_Str_Parenthesis, dateStr);
};
