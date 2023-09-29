import sampleEmployeeIcon from '@apps/commons/images/Sample_photo001.png';

import { defaultValue as dailyObjectiveEventLog } from '@attendance/domain/models/__tests__/mocks/DailyObjectivelyEventLog.mock';
import { editableTimesheet as displayFieldLayout } from '@attendance/domain/models/__tests__/mocks/DailyRecordDisplayFieldLayout.mock';
import { FixDailyRequest } from '@attendance/domain/models/approval/FixDailyRequest';
import { CODE as ATT_DAILY_ATTENTION_CODE } from '@attendance/domain/models/AttDailyAttention';
import { DAY_TYPE, DayType } from '@attendance/domain/models/AttDailyRecord';
import { Summary } from '@attendance/domain/models/BaseAttendanceSummary';
import { COMMUTE_STATE } from '@attendance/domain/models/CommuteCount';

import { time } from '@attendance/__tests__/helpers';

const records: FixDailyRequest['records'] = [...new Array(28).keys()].map(
  (idx) => {
    const i = idx + 1;
    const recordDate = `2022-02-${String(i).padStart(2, '0')}`;
    const dayType: DayType =
      i % 6 === 0
        ? DAY_TYPE.Holiday
        : i % 7 === 0
        ? DAY_TYPE.LegalHoliday
        : DAY_TYPE.Workday;
    switch (dayType) {
      case DAY_TYPE.Holiday:
        return {
          recordDate,
          dayType,
          event: '',
          shift: '',
          commuteState: null,
          dailyObjectiveEventLog: '',
          allowanceDailyRecordCount: null,
          startTime: null,
          endTime: null,
          startStampTime: null,
          endStampTime: null,
          outStartTime: null,
          outEndTime: null,
          insufficientRestTime: null,
          virtualWorkTime: null,
          restTime: null,
          realWorkTime: null,
          holidayWorkTime: null,
          overTime: null,
          nightTime: null,
          lostTime: null,
          remarks: '',
          attentions: [],
          startTimeModified: false,
          endTimeModified: false,
          isHolLegalHoliday: false,
        };
      case DAY_TYPE.LegalHoliday:
        return {
          recordDate,
          dayType,
          event: '',
          shift: '',
          commuteState: null,
          dailyObjectiveEventLog: '',
          allowanceDailyRecordCount: null,
          startTime: null,
          endTime: null,
          startStampTime: null,
          endStampTime: null,
          outStartTime: null,
          outEndTime: null,
          insufficientRestTime: null,
          virtualWorkTime: null,
          restTime: null,
          realWorkTime: null,
          holidayWorkTime: null,
          overTime: null,
          nightTime: null,
          lostTime: null,
          remarks: '',
          attentions: [],
          startTimeModified: false,
          endTimeModified: false,
          isHolLegalHoliday: false,
        };
      default:
        return {
          recordDate,
          dayType,
          event: 'Early Start Work, Direct',
          shift: 'Shift',
          commuteState: COMMUTE_STATE.BOTH_WAYS,
          dailyObjectiveEventLog: 'ObjectivelyEventLog',
          allowanceDailyRecordCount: 3,
          startTime: time(7, 0),
          endTime: time(16, 0),
          startStampTime: time(7, 0),
          endStampTime: time(16, 0),
          outStartTime: time(7, 0),
          outEndTime: time(16, 0),
          insufficientRestTime: 10,
          virtualWorkTime: time(9),
          restTime: time(1),
          realWorkTime: time(8),
          holidayWorkTime: time(1, 1),
          overTime: time(1, 2),
          nightTime: time(1, 3),
          lostTime: time(1, 4),
          remarks: 'remarks',
          attentions: [],
          startTimeModified: true,
          endTimeModified: true,
          isHolLegalHoliday: false,
        };
    }
  }
);

records[0] = {
  recordDate: '2022-02-01',
  dayType: DAY_TYPE.Workday,
  event: 'Early Start Work, Direct',
  shift: 'Shift',
  commuteState: COMMUTE_STATE.BOTH_WAYS,
  dailyObjectiveEventLog: 'ObjectivelyEventLog',
  allowanceDailyRecordCount: 3,
  startTime: time(7, 0),
  endTime: time(16, 0),
  startStampTime: time(7, 0),
  endStampTime: time(16, 0),
  outStartTime: time(7, 0),
  outEndTime: time(16, 0),
  insufficientRestTime: 10,
  virtualWorkTime: time(9),
  restTime: time(1),
  realWorkTime: time(8),
  holidayWorkTime: time(1, 1),
  overTime: time(1, 2),
  nightTime: time(1, 3),
  lostTime: time(1, 4),
  remarks: 'remarks',
  attentions: [
    {
      code: ATT_DAILY_ATTENTION_CODE.INEFFECTIVE_WORKING_TIME,
      value: {
        fromTime: time(1),
        toTime: time(2),
      },
    },
    {
      code: ATT_DAILY_ATTENTION_CODE.INSUFFICIENT_REST_TIME,
      value: 10,
    },
    {
      code: ATT_DAILY_ATTENTION_CODE.OVER_ALLOWING_DEVIATION_TIME,
    },
  ],
  startTimeModified: true,
  endTimeModified: true,
  isHolLegalHoliday: false,
};

export const defaultValue: FixDailyRequest = {
  id: 'requestId',
  requestDate: '2022-02-22',
  startDate: null,
  endDate: null,
  submitter: {
    employee: {
      name: 'Employee Name',
      code: 'EMP-0001',
      photoUrl: sampleEmployeeIcon,
      department: {
        name: 'Department Name',
      },
    },
    delegator: {
      employee: {
        name: 'Delegator Name',
      },
    },
  },
  targetDate: '2022-02-21',
  targetRecord: records[20],
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
  records,
  recordTotal: {
    restTime: 1,
    realWorkTime: 2,
    overTime: 3,
    nightTime: 4,
    lostTime: 5,
    virtualWorkTime: 6,
    holidayWorkTime: 7,
  },
  workingType: {
    useAllowanceManagement: true,
    useManageCommuteCount: true,
    useObjectivelyEventLog: true,
    useRestReason: true,
  },
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
      name: 'AgreementSummary',
      items: [
        {
          value: 2000,
          unit: 'hours',
          name: 'OutAgreementMonthlyOvertime',
          daysAndHours: null,
        },
        {
          value: 2500,
          unit: 'hours',
          name: 'OutAgreementSpecialMonthlyOvertime',
          daysAndHours: null,
        },
        {
          value: 3000,
          unit: 'hours',
          name: 'OutAgreementYearlyOvertimeTotal',
          daysAndHours: null,
        },
        {
          value: 3500,
          unit: 'hours',
          name: 'OutAgreementSpecialYearlyOvertimeTotal',
          daysAndHours: null,
        },
        {
          value: 2800,
          unit: 'hours',
          name: 'SafetyObligationalExcessTime',
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
          items: [
            {
              name: 'CustomGeneralPaidLeave1',
              value: 3,
              unit: 'days',
            },
            {
              name: 'CustomGeneralPaidLeave2',
              value: 3,
              unit: 'hours',
            },
            {
              name: 'CustomGeneralPaidLeave3',
              value: 3,
              unit: 'count',
            },
            {
              name: 'CustomGeneralPaidLeave4',
              value: null,
              daysAndHours: {
                days: 4,
                hours: 6,
              },
              unit: 'daysAndHours',
            },
          ],
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
          items: [
            {
              name: 'CustomUnpaidLeave1',
              value: 3,
              unit: 'days',
            },
          ],
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

export const dividedInnerSummaries: Summary[] = [
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
        items: [
          {
            name: 'CustomGeneralPaidLeave1',
            value: 3,
            unit: 'days',
          },
          {
            name: 'CustomGeneralPaidLeave2',
            value: 3,
            unit: 'hours',
          },
          {
            name: 'CustomGeneralPaidLeave3',
            value: 3,
            unit: 'count',
          },
          {
            name: 'CustomGeneralPaidLeave4',
            value: null,
            daysAndHours: {
              days: 4,
              hours: 6,
            },
            unit: 'daysAndHours',
          },
        ],
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
        items: [
          {
            name: 'CustomUnpaidLeave1',
            value: 3,
            unit: 'days',
          },
        ],
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
];
