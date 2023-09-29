import { defaultValue as historyList } from '@attendance/repositories/approval/__tests__/mocks/RequestHistoryList.mock';
import { defaultValue as attendanceSummary } from '@attendance/repositories/approval/models/__tests__/mocks/AttendanceSummary.mock';

import { STATUS } from '@attendance/domain/models/approval/FixMonthlyRequest';

import { Response } from '../../fetch';

export const defaultValue: Response = {
  id: 'summaryId',
  status: STATUS.PENDING,
  employeeName: 'Employee Name',
  employeePhotoUrl: 'employee-photo-url',
  delegatedEmployeeName: 'Delegated Employee Name',
  comment: 'comment',
  historyList,
  ...attendanceSummary,
};
