import { histories as historyList } from '@apps/domain/models/approval/request/__test__/mocks/History';
import { records } from '@attendance/domain/models/__tests__/mocks/BaseAttendanceSummary.mock';
import { defaultValue as dailyObjectiveEventLog } from '@attendance/domain/models/__tests__/mocks/DailyObjectivelyEventLog.mock';
import { editableTimesheet as displayFieldLayout } from '@attendance/domain/models/__tests__/mocks/DailyRecordDisplayFieldLayout.mock';
import {
  FixMonthlyRequest,
  STATUS,
} from '@attendance/domain/models/approval/FixMonthlyRequest';

import { time } from '@attendance/__tests__/helpers';

export { records };

export const defaultValue: FixMonthlyRequest = {
  id: 'summaryId',
  status: STATUS.PENDING,
  submitter: {
    employee: {
      code: 'EMPLOYEE_CODE',
      name: 'Employee Name',
      photoUrl: 'employee-photo-url',
      department: {
        name: 'Department Name',
      },
    },
    delegator: {
      employee: {
        name: 'Delegated Employee Name',
      },
    },
  },
  comment: 'comment',
  startDate: '2020-01-01',
  endDate: '2020-01-31',
  records,
  recordTotal: {
    restTime: 0,
    realWorkTime: 0,
    overTime: 0,
    nightTime: 0,
    lostTime: 0,
    virtualWorkTime: 0,
    holidayWorkTime: 0,
  },
  historyList,
  ownerInfos: [
    {
      startDate: '2022-02-01',
      endDate: '20222-02-28',
      employee: {
        name: 'Employee Name',
        code: 'EMP_CODE',
      },
      department: {
        name: 'Department Name',
      },
      workingType: {
        name: 'Working Type Name',
      },
    },
  ],
  summaries: [
    {
      name: 'DaysSummary',
      items: [
        {
          value: 22,
          unit: 'days',
          name: 'ContractualWorkDays',
          daysAndHours: null,
        },
        {
          value: 7,
          unit: 'days',
          name: 'RealWorkDays',
          daysAndHours: null,
        },
      ],
    },
    {
      name: 'WorkTimeSummary',
      items: [
        {
          value: 10560,
          unit: 'hours',
          name: 'ContractedWorkHours',
          daysAndHours: null,
        },
        {
          value: 3316,
          unit: 'hours',
          name: 'RealWorkTime',
          daysAndHours: null,
        },
        {
          value: 3316,
          unit: 'hours',
          name: 'PlainTime',
          daysAndHours: null,
        },
        {
          value: -7244,
          unit: 'hours',
          name: 'DifferenceTime',
          daysAndHours: null,
        },
      ],
    },
    {
      name: 'OverTimeSummary2',
      items: [
        {
          value: 0,
          unit: 'hours',
          name: 'WorkTime04',
          daysAndHours: null,
        },
      ],
    },
    {
      name: 'LostTimeSummary',
      items: [
        {
          value: 0,
          unit: 'hours',
          name: 'LateArriveTime',
          daysAndHours: null,
        },
        {
          value: 0,
          unit: 'hours',
          name: 'EarlyLeaveTime',
          daysAndHours: null,
        },
      ],
    },
    {
      name: 'AnnualPaidLeaveSummary',
      items: [
        {
          value: 0,
          unit: 'days',
          name: 'AnnualPaidLeaveDays',
          daysAndHours: null,
          closingDate: '2020-01-06',
        },
      ],
    },
    {
      name: 'GeneralPaidLeaveSummary',
      items: [
        {
          value: 0,
          unit: 'days',
          name: 'GeneralPaidLeaveDays',
          items: [],
          daysAndHours: null,
        },
      ],
    },
    {
      name: 'UnpaidLeaveSummary',
      items: [
        {
          value: 0,
          unit: 'days',
          name: 'UnpaidLeaveDays',
          items: [],
          daysAndHours: null,
        },
      ],
    },
    {
      name: 'AbsenceSummary',
      items: [
        {
          value: 0.0,
          unit: 'days',
          name: 'WorkAbsenceDays',
          daysAndHours: null,
        },
      ],
    },
    {
      name: 'AnnualPaidLeaveLeftSummary',
      items: [
        {
          value: 19,
          unit: 'days',
          name: 'AnnualPaidLeaveDaysLeft',
          daysAndHours: null,
        },
      ],
    },
  ],
  dividedSummaries: [],
  attention: {
    ineffectiveWorkingTime: 1,
    insufficientRestTime: 1,
  },
  workingType: {
    useManageCommuteCount: true,
    useAllowanceManagement: true,
    useObjectivelyEventLog: true,
    useRestReason: true,
  },
  dailyAllowanceRecords: [
    {
      recordDate: '2022-02-01',
      dailyAllowanceList: [
        {
          id: 'AL-0001',
          allowanceName: 'A Name 1',
          allowanceCode: 'A-CODE 1',
          managementType: 'StartEndTime',
          order: 0,
          startTime: time(7),
          endTime: time(9),
          totalTime: time(2),
          quantity: null,
        },
        {
          id: 'AL-0002',
          allowanceName: 'A Name 2',
          allowanceCode: 'A-CODE-2',
          managementType: 'Quantity',
          order: 0,
          startTime: time(7),
          endTime: time(9),
          totalTime: time(1),
          // @ts-ignore
          quantity: 1,
        },
        {
          id: 'AL-0003',
          allowanceName: 'A Name 3',
          allowanceCode: 'A-CODE-3',
          managementType: 'Hours',
          order: 0,
          startTime: null,
          endTime: null,
          totalTime: time(2),
          // @ts-ignore
          quantity: 1,
        },
        {
          id: 'AL-0004',
          allowanceName: 'A Name 4',
          allowanceCode: 'A-CODE 4',
          managementType: 'None',
          order: 0,
          startTime: time(7),
          endTime: time(9),
          totalTime: time(2),
          // @ts-ignore
          quantity: 1,
        },
      ],
    },
  ],
  dailyObjectiveEventLogRecords: [dailyObjectiveEventLog],
  dailyRestRecords: [],
  displayFieldLayout,
};
