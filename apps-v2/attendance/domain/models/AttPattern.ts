import { compose } from '../../../commons/utils/FnUtil';

import { DayType } from '@attendance/domain/models/AttDailyRecord';
import {
  WORK_SYSTEM_TYPE,
  WorkingType,
} from '@attendance/domain/models/WorkingType';

import { BaseAttDailyRequest } from './AttDailyRequest/BaseAttDailyRequest';
import { PatternRequest } from './AttDailyRequest/PatternRequest';
import * as RestTime from './RestTime';

export type AttPatternFromRemote = {
  name: string;
  code: string;
  startTime: number | null;
  endTime: number | null;
  rest1StartTime: number | null;
  rest1EndTime: number | null;
  rest2StartTime: number | null;
  rest2EndTime: number | null;
  rest3StartTime: number | null;
  rest3EndTime: number | null;
  rest4StartTime: number | null;
  rest4EndTime: number | null;
  rest5StartTime: number | null;
  rest5EndTime: number | null;
  workSystem: string;
  flexStartTime: number | null;
  flexEndTime: number | null;
  withoutCoreTime: boolean;
};

export type DailyAttPattern = {
  requestableDayType: DayType;
  canDirectInputTimeRequest: boolean;
  patterns: AttPattern[];
};

export type AttPattern = {
  name: string;
  code: string;
  startTime: number | null;
  endTime: number | null;
  restTimes: RestTime.RestTimes;
  workSystem: string;
  flexStartTime: number | null;
  flexEndTime: number | null;
  withoutCoreTime: boolean;
};

export const REGULAR_SHIFT_CODE = 'WITHOUT_PATTERN(REGULAR_SHIFT)';
export const createRegularShift = (
  name: string,
  workingType: WorkingType
): AttPattern => ({
  name,
  code: REGULAR_SHIFT_CODE,
  startTime: workingType.startTime,
  endTime: workingType.endTime,
  restTimes: workingType.restTimes,
  workSystem: workingType.workSystem,
  flexStartTime: workingType.flexStartTime,
  flexEndTime: workingType.flexEndTime,
  withoutCoreTime: workingType.withoutCoreTime,
});

const defalutDirectInputRestTime = (): {
  startTime: any;
  endTime: any;
  restReason: any;
}[] => [
  {
    startTime: null,
    endTime: null,
    restReason: null,
  },
  {
    startTime: null,
    endTime: null,
    restReason: null,
  },
  {
    startTime: null,
    endTime: null,
    restReason: null,
  },
  {
    startTime: null,
    endTime: null,
    restReason: null,
  },
  {
    startTime: null,
    endTime: null,
    restReason: null,
  },
];

export const DIRECT_INPUT = 'DIRECT_INPUT';
export const createDirectInput = (
  name: string,
  patternRequest: BaseAttDailyRequest | null
): AttPattern => ({
  name,
  code: DIRECT_INPUT,
  startTime: patternRequest === null ? null : patternRequest.startTime,
  endTime: patternRequest === null ? null : patternRequest.endTime,
  restTimes:
    patternRequest === null
      ? defalutDirectInputRestTime()
      : patternRequest.patternRestTimes,
  workSystem: patternRequest === null ? null : patternRequest.workSystem,
  flexStartTime: patternRequest === null ? null : patternRequest.flexStartTime,
  flexEndTime: patternRequest === null ? null : patternRequest.flexEndTime,
  withoutCoreTime:
    patternRequest === null ? null : patternRequest.withoutCoreTime,
});

const mapRestTime = (
  fromRemote: AttPatternFromRemote
): {
  startTime: any;
  endTime: any;
}[] => [
  {
    startTime: fromRemote.rest1StartTime,
    endTime: fromRemote.rest1EndTime,
  },
  {
    startTime: fromRemote.rest2StartTime,
    endTime: fromRemote.rest2EndTime,
  },
  {
    startTime: fromRemote.rest3StartTime,
    endTime: fromRemote.rest3EndTime,
  },
  {
    startTime: fromRemote.rest4StartTime,
    endTime: fromRemote.rest4EndTime,
  },
  {
    startTime: fromRemote.rest5StartTime,
    endTime: fromRemote.rest5EndTime,
  },
];

const createRestTimesFromRemote = (
  fromRemote: AttPatternFromRemote
): RestTime.RestTimes =>
  compose(RestTime.convertRestTimes, mapRestTime)(fromRemote);

export const createFromRemote = (
  fromRemote: AttPatternFromRemote
): AttPattern => ({
  name: fromRemote.name,
  code: fromRemote.code,
  startTime: fromRemote.startTime,
  endTime: fromRemote.endTime,
  restTimes: createRestTimesFromRemote(fromRemote),
  workSystem: fromRemote.workSystem,
  flexStartTime: fromRemote.flexStartTime,
  flexEndTime: fromRemote.flexEndTime,
  withoutCoreTime: fromRemote.withoutCoreTime,
});

export const createFromPatternRequest = (
  param: PatternRequest
): AttPattern => ({
  name: param.patternName || '',
  code: param.patternCode || '',
  startTime: param.startTime,
  endTime: param.endTime,
  restTimes: param.patternRestTimes,
  workSystem: param.workSystem,
  flexStartTime: param.flexStartTime,
  flexEndTime: param.flexEndTime,
  withoutCoreTime: param.withoutCoreTime,
});

/**
 * Find AttPattern by PatternCode or get head from Array.
 *
 * FIXME: This code is needed view files,
 *        not domain,
 *        but we don't have a way to write code for view's common method.
 *
 * @param {*} attPatternList
 * @param {*} patternCode
 */
export const getDefaultPatternCode = (
  attPatternList: AttPattern[],
  patternCode: string | null
): AttPattern | null => {
  return (
    attPatternList.find((pattern) => pattern.code === patternCode) ||
    attPatternList[0] ||
    null
  );
};

/**
 * コアなしフレックスかどうか
 */
export const isFlexWithoutCoreTime = (pattern: AttPattern): boolean =>
  pattern?.workSystem === WORK_SYSTEM_TYPE.JP_Flex &&
  pattern?.withoutCoreTime === true;

export type IAttPatternRepository = {
  fetch: (params: {
    targetDate: string;
    ignoredId?: string;
    employeeId?: string;
  }) => Promise<DailyAttPattern>;
};
