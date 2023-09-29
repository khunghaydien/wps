import { generateSummaryGroup, generateSummaryItem } from './helpers/summary';

export default [
  generateSummaryGroup('DaysSummary', [
    generateSummaryItem('ContractualWorkDays', 'days', 11),
    generateSummaryItem('RealWorkDays', 'days', 11),
    generateSummaryItem('LegalHolidayWorkCount', 'days', 11),
    generateSummaryItem('HolidayWorkCount', 'days', 11),
  ]),
  generateSummaryGroup('WorkTimeSummary', [
    generateSummaryItem('ContractedWorkHours', 'hours', 11 * 60),
    generateSummaryItem('DifferenceTime', 'hours', 11 * 60),
    generateSummaryItem('PlainTime', 'hours', 11 * 60),
    generateSummaryItem('RealWorkTime', 'hours', 11 * 60),
    generateSummaryItem('VirtualWorkTime', 'hours', 11 * 60),
    generateSummaryItem('WholeLegalWorkTime', 'hours', 11 * 60),
  ]),
  generateSummaryGroup('LegalOverSummary', [
    generateSummaryItem('LegalWorkHours', 'hours', 11 * 60),
    generateSummaryItem('LegalOverTime', 'hours', 11 * 60),
    generateSummaryItem('QuarterLegalOverTime', 'hours', 11 * 60),
    generateSummaryItem('YearLegalOverTime', 'hours', 11 * 60),
    generateSummaryItem('YearLegalOverCount', 'count', 11),
    generateSummaryItem('SafetyObligationalExcessTime', 'hours', 11 * 60),
  ]),
  generateSummaryGroup('OverTimeSummary1', [
    generateSummaryItem('WorkTime01', 'hours', 11 * 60),
    generateSummaryItem('WorkTime02', 'hours', 11 * 60),
    generateSummaryItem('WorkTime03', 'hours', 11 * 60),
  ]),
  generateSummaryGroup('OverTimeSummary2', [
    generateSummaryItem('WorkTime04', 'hours', 11 * 60),
    generateSummaryItem('WorkTime05', 'hours', 11 * 60),
    generateSummaryItem('WorkTime06', 'hours', 11 * 60),
    generateSummaryItem('WorkTime07', 'hours', 11 * 60),
  ]),
  generateSummaryGroup('LostTimeSummary', [
    generateSummaryItem('LateArriveCount', 'count', 11),
    generateSummaryItem('LateArriveTime', 'hours', 11 * 60),
    generateSummaryItem('LateArriveLostTime', 'hours', 11 * 60),
    generateSummaryItem('EarlyLeaveCount', 'count', 11),
    generateSummaryItem('EarlyLeaveTime', 'hours', 11 * 60),
    generateSummaryItem('EarlyLeaveLostTime', 'hours', 11 * 60),
    generateSummaryItem('BreakLostCount', 'count', 11),
    generateSummaryItem('BreakTime', 'hours', 11 * 60),
    generateSummaryItem('BreakLostTime', 'hours', 11 * 60),
  ]),
  generateSummaryGroup('LeaveSummary', [
    generateSummaryItem('GeneralPaidLeaveDays', 'daysAndHours', 11, 11 * 60),
    generateSummaryItem('UnpaidLeaveDays', 'daysAndHours', 11, 11 * 60),
  ]),
  generateSummaryGroup('AbsenceSummary', [
    generateSummaryItem('WorkAbsenceDays', 'days', 3),
  ]),
];
