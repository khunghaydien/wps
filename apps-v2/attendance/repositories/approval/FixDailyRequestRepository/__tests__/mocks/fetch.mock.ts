import { defaultValue as attendanceSummary } from '@attendance/repositories/approval/models/__tests__/mocks/AttendanceSummary.mock';

import { STATUS } from '@attendance/domain/models/approval/FixDailyRequest';

import { Response } from '../../fetch';

export const defaultValue: Response = {
  id: 'summaryId',
  status: STATUS.PENDING,
  photoUrl: 'employee-photo-url',
  departmentName: 'Department Name',
  delegatedEmployeeName: 'Delegated Employee Name',
  requestDate: '2022-02-28',
  targetDate: '2022-02-22',
  ...attendanceSummary,
};
