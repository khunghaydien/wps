/**
 * 編集用専用既存申請を作成する Factory です。
 */
import { compose } from '@commons/utils/FnUtil';

import { DayType } from '@attendance/domain/models/AttDailyRecord';
import * as HolidayWorkRequest from '@attendance/domain/models/AttDailyRequest/HolidayWorkRequest';
import {
  DIRECT_INPUT,
  IAttPatternRepository,
} from '@attendance/domain/models/AttPattern';
import { WorkingType } from '@attendance/domain/models/WorkingType';

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
    dayType,
    workingType,
    patternName,
    ignoredId,
  }: {
    employeeId?: string;
    dayType: DayType;
    workingType: WorkingType;
    patternName: PatternName | (() => PatternName);
    ignoredId?: string;
  }): IHolidayWorkRequestFactory => ({
    create: async (request) => {
      const $patternName =
        typeof patternName === 'function' ? patternName() : patternName;
      return compose(
        setPatternCode,
        setDirectInputPatternToPatterns($patternName[DIRECT_INPUT]),
        await setPatterns({ AttPatternRepository })(workingType)({
          employeeId,
          ignoredId,
          targetDate: request.startDate,
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
