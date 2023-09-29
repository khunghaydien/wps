import { defaultValue as attendanceSummary } from '@attendance/repositories/models/__tests__/mocks/BaseAttendanceSummary.mock';

import { STATUS } from '@attendance/domain/models/AttendanceSummary';

import { Response } from '../../fetch';

export const defaultValue: Response = {
  status: STATUS.PENDING,
  summaryName: 'Summary Name',
  employeeName: 'Employee Name',
  employeeCode: 'EMPLOYEE_CODE',
  employeeInfoList: [
    {
      startDate: attendanceSummary.startDate,
      endDate: attendanceSummary.endDate,
      workingTypeName: 'Working Type Name',
      departmentName: 'Department Name',
    },
  ],
  hasCalculatedAbsence: true,
  useRestReason: false,
  ...attendanceSummary,
};
