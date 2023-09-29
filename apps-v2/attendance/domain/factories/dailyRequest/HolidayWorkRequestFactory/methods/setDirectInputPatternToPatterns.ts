import * as HolidayWorkRequest from '@attendance/domain/models/AttDailyRequest/HolidayWorkRequest';
import { createDirectInput } from '@attendance/domain/models/AttPattern';

export default (patternName: (() => string) | string) =>
  (request: HolidayWorkRequest.HolidayWorkRequest) => {
    const $patternName =
      typeof patternName === 'function' ? patternName() : patternName;
    const directInput = createDirectInput($patternName, null);
    const patterns = request.patterns?.filter(({ code }) => code) || [];
    return {
      ...request,
      patterns: [directInput, ...patterns],
    };
  };
