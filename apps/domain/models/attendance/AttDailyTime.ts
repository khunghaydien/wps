import { filter as filterRestTimes, RestTimes } from './RestTime';

export type AttDailyTimeForRemoteUpdate = {
  empId: string | null;
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
  restHours: number | null;
};

export type AttDailyTime = {
  empId?: string;
  targetDate: string;
  startTime: number | null;
  endTime: number | null;
  restTimes: RestTimes;
  restHours: number | null;
};

// eslint-disable-next-line import/prefer-default-export
export const convertToUpdateRequestParam = (
  time: AttDailyTime
): AttDailyTimeForRemoteUpdate => {
  const param: AttDailyTimeForRemoteUpdate = {
    empId: time.empId || null,
    startTime: time.startTime,
    endTime: time.endTime,
    rest1StartTime: null,
    rest1EndTime: null,
    rest2StartTime: null,
    rest2EndTime: null,
    rest3StartTime: null,
    rest3EndTime: null,
    rest4StartTime: null,
    rest4EndTime: null,
    rest5StartTime: null,
    rest5EndTime: null,
    restHours: time.restHours,
  };
  const restTimes = filterRestTimes(time.restTimes);

  if (restTimes[0] !== undefined && restTimes[0] !== null) {
    param.rest1StartTime = restTimes[0].startTime;
    param.rest1EndTime = restTimes[0].endTime;
  }
  if (restTimes[1] !== undefined && restTimes[1] !== null) {
    param.rest2StartTime = restTimes[1].startTime;
    param.rest2EndTime = restTimes[1].endTime;
  }
  if (restTimes[1] !== undefined && restTimes[1] !== null) {
    param.rest2StartTime = restTimes[1].startTime;
    param.rest2EndTime = restTimes[1].endTime;
  }
  if (restTimes[2] !== undefined && restTimes[2] !== null) {
    param.rest3StartTime = restTimes[2].startTime;
    param.rest3EndTime = restTimes[2].endTime;
  }
  if (restTimes[3] !== undefined && restTimes[3] !== null) {
    param.rest4StartTime = restTimes[3].startTime;
    param.rest4EndTime = restTimes[3].endTime;
  }
  if (restTimes[4] !== undefined && restTimes[4] !== null) {
    param.rest5StartTime = restTimes[4].startTime;
    param.rest5EndTime = restTimes[4].endTime;
  }
  return param;
};
