import { RestTime } from '../RestTime';
import { TimeRange } from '../TimeRange';
import { DailyRequest } from './DailyRequest';

export type DailyRecord = {
  id: string;
  recordDate: string;
  startTime: TimeRange['startTime'];
  endTime: TimeRange['endTime'];
  restTimes: RestTime[];
  requests: DailyRequest[];
  comment: string;
};
