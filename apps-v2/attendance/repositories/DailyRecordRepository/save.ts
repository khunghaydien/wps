import Api from '@apps/commons/api';

import { IDailyRecordRepository } from '@attendance/domain/models/AttDailyRecord';

export type Result = {
  insufficientRestTime: number | null | undefined;
};

type DailyRest = {
  restStartTime: number | null;
  restEndTime: number | null;
  restReasonId: string | null;
};

export type RequestParameters = {
  targetDate: string;
  empId: string | null;
  startTime: number | null;
  endTime: number | null;
  dailyRestList: DailyRest[];
  restHours: number | null;
  otherRestReason: string | null;
  commuteCount: {
    forwardCount: number | null;
    backwardCount: number | null;
  };
  remarks: string | null;
};

const convertToParam = (
  record: Parameters<IDailyRecordRepository['save']>[0]
): RequestParameters => {
  const param: RequestParameters = {
    empId: record.employeeId || null,
    targetDate: record.recordDate,
    startTime: record.startTime,
    endTime: record.endTime,
    dailyRestList: [],
    restHours: record.restHours,
    otherRestReason: record.otherRestReason?.id || null,
    commuteCount: record.commuteCount,
    remarks: record.remarks,
  };
  const restTimes = record.restTimes;

  if (restTimes?.length > 0) {
    restTimes.forEach((rest) => {
      if (rest !== undefined && rest !== null) {
        param.dailyRestList.push({
          restStartTime: rest.startTime,
          restEndTime: rest.endTime,
          restReasonId: rest.restReason?.id || null,
        });
      }
    });
  }
  return param;
};

const save: IDailyRecordRepository['save'] = (entity) => {
  return Api.invoke({
    path: '/att/daily-time/save',
    param: convertToParam(entity),
  });
};

export default save;
