import groupBy from 'lodash/groupBy';

import {
  Summary,
  SUMMARY_NAME,
} from '@attendance/domain/models/BaseAttendanceSummary';

const POSITION: {
  [key: string]: 'left' | 'center' | 'right';
} = {
  [SUMMARY_NAME.DAYS_SUMMARY]: 'left',
  [SUMMARY_NAME.WORK_TIME_SUMMARY]: 'left',
  [SUMMARY_NAME.AGREEMENT_SUMMARY]: 'left',
  [SUMMARY_NAME.LEGAL_OVER_SUMMARY]: 'left',
  [SUMMARY_NAME.COMMUTE_COUNT_SUMMARY]: 'left',
  [SUMMARY_NAME.OVER_TIME_SUMMARY1]: 'center',
  [SUMMARY_NAME.OVER_TIME_SUMMARY2]: 'center',
  [SUMMARY_NAME.LOST_TIME_SUMMARY]: 'center',
  [SUMMARY_NAME.LEAVE_SUMMARY]: 'right',
  [SUMMARY_NAME.ANNUAL_PAID_LEAVE_SUMMARY]: 'right',
  [SUMMARY_NAME.GENERAL_PAID_LEAVE_SUMMARY]: 'right',
  [SUMMARY_NAME.UNPAID_LEAVE_SUMMARY]: 'right',
  [SUMMARY_NAME.ABSENCE_SUMMARY]: 'right',
  [SUMMARY_NAME.ANNUAL_PAID_LEAVE_LEFT_SUMMARY]: 'right',
} as const;

export const toGroup = <T extends Summary>(
  summaries: T[]
): Map<'left' | 'center' | 'right', T[]> => {
  const grouped = groupBy(
    summaries,
    (summary) => POSITION[summary.name] || 'left'
  );
  return new Map([
    ['left', grouped.left || []],
    ['center', grouped.center || []],
    ['right', grouped.right || []],
  ]);
};
