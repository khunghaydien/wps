import { compose } from '../../../commons/utils/FnUtil';

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
};

export type AttPattern = {
  name: string;
  code: string;
  startTime: number | null;
  endTime: number | null;
  restTimes: RestTime.RestTimes;
};

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
  compose(RestTime.filter, RestTime.create, mapRestTime)(fromRemote);

export const createFromRemote = (
  fromRemote: AttPatternFromRemote
): AttPattern => ({
  name: fromRemote.name,
  code: fromRemote.code,
  startTime: fromRemote.startTime,
  endTime: fromRemote.endTime,
  restTimes: createRestTimesFromRemote(fromRemote),
});

export const createFromPatternRequest = (
  param: PatternRequest
): AttPattern => ({
  name: param.patternName || '',
  code: param.patternCode || '',
  startTime: param.startTime,
  endTime: param.endTime,
  restTimes: param.patternRestTimes,
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
