import Api from '@apps/commons/api';
import { compose } from '@apps/commons/utils/FnUtil';

import { DayType } from '@apps/attendance/domain/models/AttDailyRecord';
import {
  ContractedWorkTime as DomainContractedWorkTime,
  ContractedWorkTimeRecord as DomainContractedWorkTimeRecord,
  IContractedWorkTimeRepository,
} from '@attendance/domain/models/importer/ContractedWorkTime';
import * as DomainTimeRange from '@attendance/domain/models/TimeRange';

type Record = {
  recordDate: string;
  startTime: number | null;
  endTime: number | null;
  dayType: DayType;
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

type Response = {
  summaryList: {
    startDate: string;
    endDate: string;
    workingTypeList: {
      startDate: string;
      endDate: string;
    }[];
    recordList: Record[];
  }[];
};

const mapRestTime = (record: Record): DomainTimeRange.TimeRange[] => [
  {
    startTime: record.rest1StartTime,
    endTime: record.rest1EndTime,
  },
  {
    startTime: record.rest2StartTime,
    endTime: record.rest2EndTime,
  },
  {
    startTime: record.rest3StartTime,
    endTime: record.rest3EndTime,
  },
  {
    startTime: record.rest4StartTime,
    endTime: record.rest4EndTime,
  },
  {
    startTime: record.rest5StartTime,
    endTime: record.rest5EndTime,
  },
];

const filterRestTime = (arr: DomainTimeRange.TimeRange[]) =>
  arr.filter(DomainTimeRange.hasTimes);

const createRestTimes = (record: Record): DomainTimeRange.TimeRange[] =>
  compose(
    filterRestTime,
    (arr) => arr.map(DomainTimeRange.create),
    mapRestTime
  )(record);

const convertRecord = (response: Record): DomainContractedWorkTimeRecord => ({
  recordDate: response.recordDate,
  startTime: response.startTime,
  endTime: response.endTime,
  restTimes: createRestTimes(response),
  dayType: response.dayType,
});

const convert = (
  response: Response['summaryList'][number]
): DomainContractedWorkTime => ({
  startDate: response.startDate,
  endDate: response.endDate,
  workingTypes: response.workingTypeList,
  records: new Map(
    response.recordList.map((record) => [
      record.recordDate,
      convertRecord(record),
    ])
  ),
});

export default ((param) =>
  Api.invoke({
    path: '/att/timesheet-import/default/get',
    param: {
      empId: param.employeeId,
      startDate: param.startDate,
      endDate: param.endDate,
    },
  }).then((response: Response) =>
    response?.summaryList?.map(convert)
  )) as IContractedWorkTimeRepository['fetch'];
