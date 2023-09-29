import * as RestTime from '@attendance/domain/models/RestTime';

export default (
  idx: number,
  records: RestTime.RestTimes,
  maxLength: number
): boolean =>
  RestTime.isLast(idx)(records) && RestTime.isAddable(maxLength)(idx)(records);
