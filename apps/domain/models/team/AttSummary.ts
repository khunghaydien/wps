import { $ReadOnly } from 'utility-types';

import { Status } from '../approval/request/Status';

export type AttSummary = {
  records: {
    employeeId: string;
    employeeCode: string;
    employeeName: string;
    photoUrl: string;
    workingTypeName: string;
    startDate: string;
    endDate: string;
    status: Status;
    approverName: string;
  }[];
};

export type AttSummaryFromRemote = $ReadOnly<{
  records: {
    employeeId: string;
    employeeCode: string;
    employeeName: string;
    photoUrl: string;
    workingTypeName: string;
    startDate: string;
    endDate: string;
    status: Status;
    approverName: string;
  }[];
}>;

// eslint-disable-next-line import/prefer-default-export
export const createFromRemote = (
  fromRemote: AttSummaryFromRemote
): AttSummary => ({
  records: fromRemote.records.map((record) => ({ ...record })),
});
