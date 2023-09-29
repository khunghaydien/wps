import { DAY_TYPE } from '@attendance/domain/models/AttDailyRecord';

import { Response } from '../../fetch';

const pattern = {
  name: 'Name',
  code: 'Code',
  startTime: 480,
  endTime: 1200,
  rest1StartTime: 720,
  rest1EndTime: 725,
  rest2StartTime: 730,
  rest2EndTime: 735,
  rest3StartTime: 740,
  rest3EndTime: 745,
  rest4StartTime: 750,
  rest4EndTime: 755,
  rest5StartTime: 760,
  rest5EndTime: 764,
  workSystem: 'WorkSystem',
  flexStartTime: 540,
  flexEndTime: 1080,
  withoutCoreTime: false,
};

export const workDayAndAllowedDirect: Response = {
  requestableDayType: DAY_TYPE.Workday,
  canDirectInputTimeRequest: true,
  patterns: [pattern],
};
