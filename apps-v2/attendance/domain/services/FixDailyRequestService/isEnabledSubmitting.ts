import { AttDailyRecord } from '@attendance/domain/models/AttDailyRecord';
import { ACTIONS_FOR_FIX } from '@attendance/domain/models/FixDailyRequest';
import { WorkingType } from '@attendance/domain/models/WorkingType';

import { getWithinRange } from '@attendance/libraries/utils/Records';

export default ({
  targetDate,
  workingTypes,
  records,
}: {
  targetDate: string;
  workingTypes: WorkingType[] | null;
  records:
    | Pick<AttDailyRecord, 'recordDate' | 'startTime' | 'fixDailyRequest'>[]
    | null;
}) => {
  if (!targetDate) {
    return false;
  }
  const workingType = getWithinRange(targetDate, workingTypes);
  const useFixDailyRequest = workingType?.useFixDailyRequest;
  if (!useFixDailyRequest) {
    return false;
  }
  if (!records) {
    return false;
  }
  const targetRecord = records.find(
    ({ recordDate }) => recordDate === targetDate
  );
  if (!targetRecord) {
    return false;
  }
  return (
    targetRecord.fixDailyRequest?.performableActionForFix ===
      ACTIONS_FOR_FIX.Submit && targetRecord.startTime !== null
  );
};
