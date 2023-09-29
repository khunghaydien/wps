import { DailyRestRecord } from '@apps/attendance/domain/models/DailyRestRecord';

export default [
  {
    recordDate: '2022-07-04',
    restRecords: [
      {
        restReasonId: 'a0I7F000000OwqTUAS',
        restReasonName: '昼休憩',
        restReasonCode: 'code001',
        outStartTime: 720,
        outEndTime: 780,
        outRestTime: 60,
      },
      {
        restReasonId: 'a0I7F000000OwqARTY',
        restReasonName: '晩休憩',
        restReasonCode: 'code002',
        outStartTime: 1080,
        outEndTime: 1200,
        outRestTime: 120,
      },
    ],
  },
  {
    recordDate: '2022-07-05',
    restRecords: [],
  },
  {
    recordDate: '2022-07-06',
    restRecords: [
      {
        restReasonId: null,
        restReasonCode: null,
        restReasonName: null,
        outStartTime: null,
        outEndTime: null,
        outRestTime: null,
      },
    ],
  },
] as DailyRestRecord[];
