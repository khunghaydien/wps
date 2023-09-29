import { DailyAttendanceTime } from '../../../AttDailyRecord';

export const defaultValue: DailyAttendanceTime = {
  recordId: 'recordId',
  employeeId: 'employeeId',
  recordDate: '2022-01-01',
  startTime: 9 * 60,
  endTime: 20 * 60,
  restTimes: [
    {
      startTime: 9 * 60 + 50,
      endTime: 10 * 60,
      restReason: {
        id: 'a0A2800000FmMQCEA1',
        name: 'お昼休み',
        code: '001',
      },
    },
    {
      startTime: 11 * 60 + 50,
      endTime: 12 * 60,
      restReason: {
        id: 'a0A2800000FmMQCEA1',
        name: 'お昼休み',
        code: '001',
      },
    },
    {
      startTime: 13 * 60 + 50,
      endTime: 14 * 60,
      restReason: {
        id: 'a0A2800000FmMQCEA1',
        name: 'お昼休み',
        code: '001',
      },
    },
    {
      startTime: 15 * 60 + 50,
      endTime: 16 * 60,
      restReason: {
        id: 'a0A2800000FmMQCEA1',
        name: 'お昼休み',
        code: '001',
      },
    },
    {
      startTime: 17 * 60 + 50,
      endTime: 18 * 60,
      restReason: {
        id: 'a0A2800000FmMQCEA1',
        name: 'お昼休み',
        code: '001',
      },
    },
  ],
  restHours: 60,
  otherRestReason: {
    id: 'a0A2800000FmMQCEA1',
    name: 'お昼休み',
    code: '001',
  },
  commuteCount: {
    forwardCount: 0,
    backwardCount: 1,
  },
  remarks: 'remarks',
};
