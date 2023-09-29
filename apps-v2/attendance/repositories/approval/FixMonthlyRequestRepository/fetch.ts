import Api from '@apps/commons/api';

import adapter from '@apps/repositories/adapters';

import { AttendanceSummary, convert } from '../models/AttendanceSummary';
import { ApprovalHistoryList } from '@apps/domain/models/approval/request/History';
import {
  FixMonthlyRequest,
  IFixMonthlyRequestRepository,
  Status,
} from '@attendance/domain/models/approval/FixMonthlyRequest';

export type Response = {
  id: string;
  status: Status;
  employeePhotoUrl: string;
  delegatedEmployeeName: string;
  comment: string;
} & AttendanceSummary &
  ApprovalHistoryList;

const $convert = ({
  employeePhotoUrl,
  delegatedEmployeeName,
  ...response
}: Response): FixMonthlyRequest => {
  return {
    ...response,
    ...convert(response),
    submitter: {
      employee: {
        code: response.employeeCode,
        name: response.employeeName,
        photoUrl: employeePhotoUrl,
        department: {
          name: '',
        },
      },
      delegator: {
        employee: {
          name: delegatedEmployeeName,
        },
      },
    },
  };
};

const fetch: IFixMonthlyRequestRepository['fetch'] = async (id) => {
  const response = await Api.invoke({
    path: '/att/request/monthly/get',
    param: {
      requestId: id,
    },
  });
  return adapter.fromRemote(response, [$convert]);
};

export default fetch;
