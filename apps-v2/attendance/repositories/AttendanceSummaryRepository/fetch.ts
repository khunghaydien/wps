import Api from '@apps/commons/api';

import {
  BaseAttendanceSummary,
  convert,
} from '../models/BaseAttendanceSummary';
import {
  AttendanceSummary as DomainAttendanceSummary,
  IAttendanceSummaryRepository,
  Status,
} from '@attendance/domain/models/AttendanceSummary';

export type Response = BaseAttendanceSummary & {
  summaryName: string;
  status: Status;
  hasCalculatedAbsence: boolean;
};

const $convert = ({
  hasCalculatedAbsence,
  status,
  summaryName,
  ...response
}: Response): DomainAttendanceSummary => ({
  ...convert(response),
  name: summaryName,
  status,
  hasCalculatedAbsence,
});

const fetch: IAttendanceSummaryRepository['fetch'] = async (param) => {
  const response: Response = await Api.invoke({
    path: '/att/summary/get',
    param: {
      empId: param?.employeeId,
      targetDate: param?.targetDate,
    },
  });
  return $convert(response);
};

export default fetch;
