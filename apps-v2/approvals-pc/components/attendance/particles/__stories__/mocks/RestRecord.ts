import { RestRecord } from '@apps/attendance/domain/models/DailyRestRecord';

export default [
  {
    restReasonId: 'a0I7F000000OwqTUAS',
    restReasonName: '昼休憩',
    restReasonCode: 'code001',
    outStartTime: 720,
    outEndTime: 780,
    outRestTime: 60,
  },
  {
    restReasonId: 'a0I7F000000OwqTASP',
    restReasonName: '晩休憩',
    restReasonCode: 'code002',
    outStartTime: 1080,
    outEndTime: 1200,
    outRestTime: 120,
  },
] as RestRecord[];
