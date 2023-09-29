import * as DomainDailyRestRecord from '@apps/attendance/domain/models/DailyRestRecord';

export type DailyRestRecord = {
  recordDate: string;
  dailyRestList: DomainDailyRestRecord.RestRecord[];
};

export const convert = (
  records: DailyRestRecord[]
): DomainDailyRestRecord.DailyRestRecord[] =>
  records?.map(({ recordDate, dailyRestList }) => ({
    recordDate,
    restRecords: dailyRestList,
  }));
