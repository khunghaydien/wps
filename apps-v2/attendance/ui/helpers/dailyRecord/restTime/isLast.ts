import * as RestTime from '@attendance/domain/models/RestTime';

export default (idx: number, records: RestTime.RestTimes): boolean =>
  RestTime.isLast(idx)(records);
