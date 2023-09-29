import { DayType } from '@attendance/domain/models/AttDailyRecord';
import * as HolidayWorkRequest from '@attendance/domain/models/AttDailyRequest/HolidayWorkRequest';
import { WorkingType } from '@attendance/domain/models/WorkingType';

import createSubstituteLeaveTypesFactory from '../SubstituteLeaveTypesFactory';

const SubstituteLeaveTypesFactory = createSubstituteLeaveTypesFactory();

export default ({
    dayType,
    workingType,
  }: { dayType?: DayType; workingType?: WorkingType } = {}) =>
  (
    request: HolidayWorkRequest.HolidayWorkRequest
  ): HolidayWorkRequest.HolidayWorkRequest => ({
    ...request,
    substituteLeaveTypes: SubstituteLeaveTypesFactory.create({
      request,
      workingType,
      dayType,
    }),
  });
