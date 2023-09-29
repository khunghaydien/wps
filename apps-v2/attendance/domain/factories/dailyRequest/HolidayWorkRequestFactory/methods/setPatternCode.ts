import * as HolidayWorkRequest from '@attendance/domain/models/AttDailyRequest/HolidayWorkRequest';
import { DIRECT_INPUT } from '@attendance/domain/models/AttPattern';

export default (request: HolidayWorkRequest.HolidayWorkRequest) => {
  const pattern = request.patternCode
    ? request.patterns?.find(({ code }) => code === request.patternCode)
    : null;
  return {
    ...request,
    patternCode: pattern?.code || DIRECT_INPUT,
  };
};
