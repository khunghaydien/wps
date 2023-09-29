import { ACTUAL_WORKING_PERIOD_TYPE } from '@apps/domain/models/attendance/DailyActualWorkingTimePeriod';

const ONE_HOUR_MINUTE = 60;

export const actualWorkingPeriods = [
  {
    startTime: 10 * ONE_HOUR_MINUTE,
    endTime: 12.5 * ONE_HOUR_MINUTE,
    type: ACTUAL_WORKING_PERIOD_TYPE.CONTRACT_IN_LEGAL_IN,
  },
  {
    startTime: 12.5 * ONE_HOUR_MINUTE,
    endTime: 13.5 * ONE_HOUR_MINUTE,
    type: ACTUAL_WORKING_PERIOD_TYPE.REST,
  },
  {
    startTime: 13.5 * ONE_HOUR_MINUTE,
    endTime: 18 * ONE_HOUR_MINUTE,
    type: ACTUAL_WORKING_PERIOD_TYPE.CONTRACT_IN_LEGAL_IN,
  },
  {
    startTime: 18 * ONE_HOUR_MINUTE,
    endTime: 19 * ONE_HOUR_MINUTE,
    type: ACTUAL_WORKING_PERIOD_TYPE.CONTRACT_OUT_LEGAL_IN,
  },
  {
    startTime: 19 * ONE_HOUR_MINUTE,
    endTime: 23 * ONE_HOUR_MINUTE,
    type: ACTUAL_WORKING_PERIOD_TYPE.CONTRACT_OUT_LEGAL_OUT,
  },
];

export const contractedPeriods = [
  { startTime: 10 * ONE_HOUR_MINUTE, endTime: 12 * ONE_HOUR_MINUTE },
];
