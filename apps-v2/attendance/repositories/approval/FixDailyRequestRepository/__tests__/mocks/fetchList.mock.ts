import { defaultValue as attendanceSummary } from '@attendance/repositories/approval/models/__tests__/mocks/AttendanceSummary.mock';

import { STATUS } from '@attendance/domain/models/approval/FixDailyRequest';

import { Response } from '../../fetchList';

export const defaultValue: Response = {
  requestList: [
    {
      id: 'summaryId',
      status: STATUS.PENDING,
      employeeName: 'Employee Name',
      employeeCode: 'Employee Code',
      photoUrl: 'employee-photo-url',
      departmentName: 'Department Name',
      delegatedEmployeeName: 'Delegated Employee Name',
      employeeInfoList: [
        {
          startDate: '2022-02-01',
          endDate: '2022-02-28',
          workingTypeName: 'WorkingType Name',
          departmentName: 'Department Name',
        },
      ],
      requestDate: '2022-02-28',
      targetDate: '2022-02-22',
      record: attendanceSummary.records[0],
      recordTotal: {
        restTime: 1,
        realWorkTime: 2,
        overTime: 3,
        nightTime: 4,
        lostTime: 5,
        virtualWorkTime: 6,
        holidayWorkTime: 7,
      },
      useRestReason: false,
      summaries: attendanceSummary.summaries,
      dividedSummaries: attendanceSummary.dividedSummaries,
    },
  ],
};
