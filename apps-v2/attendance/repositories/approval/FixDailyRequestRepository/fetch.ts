import Api from '@apps/commons/api';

import {
  AttendanceSummary,
  convert,
} from '@attendance/repositories/approval/models/AttendanceSummary';

import {
  FixDailyRequest,
  IFixDailyRequestRepository,
  Status,
} from '@attendance/domain/models/approval/FixDailyRequest';

export type Response = {
  id: string;
  status: Status;
  photoUrl: string;
  departmentName: string;
  delegatedEmployeeName: string;
  // comment: string;
  requestDate: string;
  targetDate: string;
} & AttendanceSummary;

const $convert = ({
  photoUrl: employeePhotoUrl,
  delegatedEmployeeName,
  ...request
}: Response): FixDailyRequest => {
  const convertedRequest = convert(request);
  const targetRecord = convertedRequest.records.find(
    (record) => record.recordDate === request.targetDate
  );
  return {
    id: request.id,
    requestDate: request.requestDate,
    targetDate: request.targetDate,
    submitter: {
      employee: {
        name: request.employeeName,
        code: request.employeeCode,
        photoUrl: employeePhotoUrl,
        department: {
          name: request.departmentName,
        },
      },
      delegator: {
        employee: {
          name: delegatedEmployeeName,
        },
      },
    },
    targetRecord,
    ...request,
    ...convertedRequest,
  };
};

const fetch: IFixDailyRequestRepository['fetch'] = async (requestId) => {
  const response: Response = await Api.invoke({
    path: '/att/request/fix-daily/get',
    param: {
      requestId,
    },
  });
  return $convert(response);
};

export default fetch;
