import * as yup from 'yup'; // for everything

import { AttDailyRequest } from '@attendance/domain/models/AttDailyRequest';
import { CODE } from '@attendance/domain/models/AttDailyRequestType';

import absence from './AbsenceRequestPageSchema';
import direct from './DirectRequestPageSchema';
import earlyLeave from './EarlyLeaveRequestPageSchema';
import earlyStartWork from './EarlyStartWorkRequestPageSchema';
import holidayWork from './HolidayWorkRequestPageSchema';
import lateArrival from './LateArrivalRequestPageSchema';
import leave from './LeaveRequestPageSchema';
import overtimeWork from './OvertimeWorkRequestPageSchema';
import pattern from './PatternRequestPageSchema';

export default yup.lazy((form: AttDailyRequest) => {
  switch (form.requestTypeCode) {
    case CODE.Leave:
      return leave();
    case CODE.Absence:
      return absence();
    case CODE.Direct:
      return direct();
    case CODE.EarlyStartWork:
      return earlyStartWork();
    case CODE.OvertimeWork:
      return overtimeWork();
    case CODE.LateArrival:
      return lateArrival();
    case CODE.EarlyLeave:
      return earlyLeave();
    case CODE.HolidayWork:
      return holidayWork();
    case CODE.Pattern:
      return pattern();
    default:
      return yup.mixed();
  }
});
