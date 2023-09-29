import Api from '../../../commons/api';

import adapter from '@apps/repositories/adapters';

import {
  createFromRemote,
  IAttPatternRepository,
} from '@attendance/domain/models/AttPattern';

export type AttPattern = {
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

export type Response = Readonly<{
  requestableDayType: string;
  canDirectInputTimeRequest: boolean;
  patterns: AttPattern[];
}>;

export default (async ({
  targetDate,
  ignoredId,
  employeeId: empId,
}: {
  targetDate: string;
  ignoredId?: string;
  employeeId?: string;
}) => {
  const response: Response = await Api.invoke({
    path: '/att/daily-pattern/list',
    param: adapter.toRemote({
      targetDate,
      ignoredId: ignoredId || '',
      empId: empId || '',
    }),
  });
  const DailyAttPattern = {
    requestableDayType: response.requestableDayType,
    canDirectInputTimeRequest: response.canDirectInputTimeRequest,
    patterns: response.patterns.map((r) =>
      adapter.fromRemote({ ...r }, [createFromRemote])
    ),
  };
  return DailyAttPattern;
}) as IAttPatternRepository['fetch'];
