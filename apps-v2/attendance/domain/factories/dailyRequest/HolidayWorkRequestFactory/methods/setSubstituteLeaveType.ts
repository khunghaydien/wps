import * as HolidayWorkRequest from '@attendance/domain/models/AttDailyRequest/HolidayWorkRequest';
import { SUBSTITUTE_LEAVE_TYPE } from '@attendance/domain/models/SubstituteLeaveType';

export default (
  request: HolidayWorkRequest.HolidayWorkRequest
): HolidayWorkRequest.HolidayWorkRequest => ({
  ...request,
  substituteLeaveType:
    request.substituteLeaveTypes?.find(
      (type) => type === request.substituteLeaveType
    ) || SUBSTITUTE_LEAVE_TYPE.None,
});
