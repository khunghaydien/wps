/**
 * 読み取り専用既存申請を作成する Factory です。
 */
import { compose } from '@commons/utils/FnUtil';

import { DayType } from '@attendance/domain/models/AttDailyRecord';
import * as HolidayWorkRequest from '@attendance/domain/models/AttDailyRequest/HolidayWorkRequest';
import { DIRECT_INPUT } from '@attendance/domain/models/AttPattern';
import { WorkingType } from '@attendance/domain/models/WorkingType';

import setDirectInputPatternToPatterns from './methods/setDirectInputPatternToPatterns';
import setSubstituteLeaveTypes from './methods/setSubstituteLeaveTypes';

const { setSubstituteLeaveType } = HolidayWorkRequest;

const addCurrentSubstituteLeaveType = (
  request: HolidayWorkRequest.HolidayWorkRequest
) => {
  const substituteLeaveTypeList = [...request.substituteLeaveTypes];

  if (request.substituteLeaveType) {
    substituteLeaveTypeList.push(request.substituteLeaveType);
  }

  return {
    ...request,
    substituteLeaveTypes: [...new Set(substituteLeaveTypeList).values()],
  };
};

interface IHolidayWorkRequestFactory
  extends HolidayWorkRequest.IHolidayWorkRequestFactory {
  create: (
    request: HolidayWorkRequest.HolidayWorkRequest
  ) => HolidayWorkRequest.HolidayWorkRequest;
}

type PatternName = {
  [DIRECT_INPUT]: (() => string) | string;
};

export default ({
  dayType,
  workingType,
  patternName,
}: {
  dayType?: DayType;
  workingType?: WorkingType;
  patternName: PatternName | (() => PatternName);
}): IHolidayWorkRequestFactory => ({
  create: (request) => {
    const $patternName =
      typeof patternName === 'function' ? patternName() : patternName;
    return compose(
      setDirectInputPatternToPatterns($patternName[DIRECT_INPUT]),
      addCurrentSubstituteLeaveType,
      setSubstituteLeaveTypes({ dayType, workingType }),
      setSubstituteLeaveType
    )(request);
  },
});
