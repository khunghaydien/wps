/**
 * 新規申請を作成する Factory です。
 */
import { compose } from '@commons/utils/FnUtil';

import { DayType } from '@attendance/domain/models/AttDailyRecord';
import * as HolidayWorkRequest from '@attendance/domain/models/AttDailyRequest/HolidayWorkRequest';
import {
  DIRECT_INPUT,
  IAttPatternRepository,
} from '@attendance/domain/models/AttPattern';
import { WorkingType } from '@attendance/domain/models/WorkingType';

import setDefaultStartDate from './methods/setDefaultStartDate';
import setDefaultWorkingTime from './methods/setDefaultWorkingTime';
import setDirectInputPatternToPatterns from './methods/setDirectInputPatternToPatterns';
import setEnabledPatternApply from './methods/setEnabledPatternApply';
import setPatternCode from './methods/setPatternCode';
import setPatterns from './methods/setPatterns';
import setSubstituteLeaveType from './methods/setSubstituteLeaveType';
import setSubstituteLeaveTypes from './methods/setSubstituteLeaveTypes';

interface IHolidayWorkRequestFactory
  extends HolidayWorkRequest.IHolidayWorkRequestFactory {
  create: (
    request: HolidayWorkRequest.HolidayWorkRequest
  ) => Promise<HolidayWorkRequest.HolidayWorkRequest>;
}

type PatternName = {
  [DIRECT_INPUT]: (() => string) | string;
};

export default ({
    AttPatternRepository,
  }: {
    AttPatternRepository: IAttPatternRepository;
  }) =>
  ({
    employeeId,
    targetDate,
    dayType,
    workingType,
    patternName,
  }: {
    employeeId?: string;
    targetDate: string;
    dayType: DayType;
    workingType: WorkingType;
    patternName: PatternName | (() => PatternName);
  }): IHolidayWorkRequestFactory => ({
    create: async (request) => {
      const $patternName =
        typeof patternName === 'function' ? patternName() : patternName;
      return compose(
        setDefaultStartDate(targetDate),
        setDefaultWorkingTime(workingType),
        setPatternCode,
        setDirectInputPatternToPatterns($patternName[DIRECT_INPUT]),
        await setPatterns({ AttPatternRepository })(workingType)({
          employeeId,
          targetDate,
        }),
        setEnabledPatternApply(workingType),
        setSubstituteLeaveType,
        setSubstituteLeaveTypes({
          dayType,
          workingType,
        })
      )(request);
    },
  });
