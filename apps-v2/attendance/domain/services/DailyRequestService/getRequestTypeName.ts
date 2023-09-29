import { AttDailyRecord } from '@attendance/domain/models/AttDailyRecord';
import {
  CODE as REQUEST_TYPE_CODE,
  Code as DailyRequestTypeCode,
  DailyRequestNameMap,
  NAME_CODE as REQUEST_TYPE_NAME_CODE,
} from '@attendance/domain/models/AttDailyRequestType';

export default (
  code: DailyRequestTypeCode,
  {
    dailyRecord,
    nameMap,
  }: {
    dailyRecord: Pick<AttDailyRecord, 'isFlexWithoutCore'>;
    nameMap: DailyRequestNameMap;
  }
): string => {
  if (code === REQUEST_TYPE_CODE.EarlyLeave && dailyRecord.isFlexWithoutCore) {
    return nameMap[REQUEST_TYPE_NAME_CODE.EarlyLeaveMinWorkHours].name;
  }

  return nameMap[code].name;
};
