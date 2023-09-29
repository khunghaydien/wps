import { DAY_TYPE } from '@apps/admin-pc/models/calendar/CalendarEvent';

import {
  BaseAttendanceSummary,
  DailyRecord,
  Summary,
  SUMMARY_ITEM_NAME,
  SUMMARY_NAME,
  UNIT,
} from '../../BaseAttendanceSummary';
import { time } from '@attendance/__tests__/helpers';

export const recordEmpty: DailyRecord = {
  recordDate: '2020-01-01',
  dayType: DAY_TYPE.Workday,
  event: '',
  shift: '',
  allowanceDailyRecordCount: null,
  dailyObjectiveEventLog: null,
  commuteCountForward: null,
  commuteCountBackward: null,
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
  isHolLegalHoliday: false,
  outInsufficientMinimumWorkHours: 0,
};

export const recordWorkday: DailyRecord = {
  recordDate: '2020-01-02',
  dayType: DAY_TYPE.Workday,
  event: 'Event',
  shift: 'Shift',
  allowanceDailyRecordCount: null,
  dailyObjectiveEventLog: null,
  commuteCountForward: 1,
  commuteCountBackward: 1,
  startTime: time(7),
  endTime: time(23),
  startStampTime: time(7) - 10,
  endStampTime: time(23) + 5,
  outStartTime: time(7),
  outEndTime: time(23),
  insufficientRestTime: null,
  virtualWorkTime: time(8),
  restTime: 60,
  realWorkTime: time(23) - time(7) - 60,
  holidayWorkTime: null,
  overTime: 60,
  nightTime: 60,
  lostTime: 10,
  remarks: 'remarks',
  isHolLegalHoliday: false,
  outInsufficientMinimumWorkHours: 0,
};

export const recordHoliday: DailyRecord = {
  recordDate: '2020-01-03',
  dayType: DAY_TYPE.Holiday,
  event: 'Event',
  shift: 'Shift',
  allowanceDailyRecordCount: null,
  dailyObjectiveEventLog: null,
  commuteCountForward: null,
  commuteCountBackward: null,
  startTime: time(7),
  endTime: time(23),
  startStampTime: time(7) - 10,
  endStampTime: time(23) + 5,
  outStartTime: time(7),
  outEndTime: time(23),
  insufficientRestTime: null,
  virtualWorkTime: time(8),
  restTime: 60,
  realWorkTime: time(23) - time(7) - 60,
  holidayWorkTime: null,
  overTime: 60,
  nightTime: 60,
  lostTime: 10,
  remarks: 'remarks',
  isHolLegalHoliday: false,
  outInsufficientMinimumWorkHours: 0,
};

export const recordLegalHoliday: DailyRecord = {
  recordDate: '2020-01-04',
  dayType: DAY_TYPE.LegalHoliday,
  event: 'Event',
  shift: 'Shift',
  allowanceDailyRecordCount: null,
  dailyObjectiveEventLog: null,
  commuteCountForward: null,
  commuteCountBackward: null,
  startTime: time(7),
  endTime: time(23),
  startStampTime: time(7) - 10,
  endStampTime: time(23) + 5,
  outStartTime: time(7),
  outEndTime: time(23),
  insufficientRestTime: null,
  virtualWorkTime: time(8),
  restTime: 60,
  realWorkTime: time(23) - time(7) - 60,
  holidayWorkTime: null,
  overTime: 60,
  nightTime: 60,
  lostTime: 10,
  remarks: 'remarks',
  isHolLegalHoliday: false,
  outInsufficientMinimumWorkHours: 0,
};

export const records: DailyRecord[] = [
  recordWorkday,
  recordHoliday,
  recordLegalHoliday,
];

export const summaries: Summary[] = [
  {
    name: SUMMARY_NAME.ABSENCE_SUMMARY,
    items: [
      {
        name: SUMMARY_ITEM_NAME.CONTRACTUAL_WORK_DAYS,
        value: 'string',
        items: [],
      },
      {
        name: SUMMARY_ITEM_NAME.REAL_WORK_DAYS,
        value: 101,
        items: [],
      },
      {
        name: SUMMARY_ITEM_NAME.COMMUTE_COUNT,
        value: null,
        items: [],
      },
      {
        name: SUMMARY_ITEM_NAME.LEGAL_HOLIDAY_WORK_COUNT,
        value: 101,
        unit: UNIT.DAYS_AND_HOURS,
        items: [],
      },
      {
        name: SUMMARY_ITEM_NAME.HOLIDAY_WORK_COUNT,
        daysAndHours: {
          days: 1,
          hours: 2,
          unit: 'unit',
        },
        value: null,
        unit: UNIT.DAYS_AND_HOURS,
        items: [],
      },
    ],
  },
  {
    name: SUMMARY_NAME.ANNUAL_PAID_LEAVE_LEFT_SUMMARY,
    items: [
      {
        name: SUMMARY_ITEM_NAME.ANNUAL_PAID_LEAVE_DAYS,
        value: 201,
        daysAndHours: {
          days: 1,
          hours: 2,
          unit: 'unit',
        },
        unit: UNIT.COUNT,
        items: [],
      },
    ],
  },
  {
    name: SUMMARY_NAME.ANNUAL_PAID_LEAVE_LEFT_SUMMARY,
    items: [
      {
        name: SUMMARY_ITEM_NAME.GENERAL_PAID_LEAVE_DAYS,
        value: 201,
        daysAndHours: {
          days: 1,
          hours: 2,
          unit: 'unit',
        },
        unit: UNIT.COUNT,
        items: [
          {
            name: 'item1',
            value: 'value',
          },
          {
            name: 'item2',
            value: 'value',
          },
        ],
      },
      {
        name: SUMMARY_ITEM_NAME.UNPAID_LEAVE_DAYS,
        value: 201,
        daysAndHours: {
          days: 1,
          hours: 2,
          unit: 'unit',
        },
        unit: UNIT.COUNT,
        items: [],
      },
    ],
  },
];

export const defaultValue: BaseAttendanceSummary = {
  employeeInfoList: [
    {
      startDate: '2020-01-01',
      endDate: '2020-01-31',
      departmentName: 'Department Name',
      workingTypeName: 'WorkingType Name',
    },
  ],
  employeeCode: 'Employee Code',
  employeeName: 'Employee Name',
  startDate: '2020-01-01',
  endDate: '2020-01-31',
  records,
  useRestReason: false,
  summaries,
  dividedSummaries: [
    {
      name: 'summary 1',
      summaryStartDate: '2020-01-01',
      summaryEndDate: '2020-01-15',
      summaries,
    },
    {
      name: 'summary 2',
      summaryStartDate: '2020-01-16',
      summaryEndDate: '2020-01-31',
      summaries,
    },
  ],
};
