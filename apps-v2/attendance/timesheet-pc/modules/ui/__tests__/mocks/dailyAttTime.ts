import { time } from '@attendance/__tests__/helpers';
import * as ViewModel from '@attendance/timesheet-pc/viewModels/EditingDailyAttendanceTimeViewModel';

const dailyAttTime: ViewModel.EditingDailyAttendanceTimeViewModel = {
  recordId: 'recordId',
  recordDate: '2020-04-16',
  startTime: time(12, 0),
  endTime: time(13, 0),
  restTimes: [
    {
      id: '0001',
      startTime: time(12, 0),
      endTime: time(13, 0),
      restReason: {
        id: 'a0A2800000FmMQCEA1',
        name: 'お昼休み',
        code: '001',
      },
    },
    {
      id: '0002',
      startTime: time(13, 42),
      endTime: time(14, 56),
      restReason: {
        id: 'a0A2800000FmMQCEA1',
        name: 'お昼休み',
        code: '001',
      },
    },
    {
      id: '0003',
      startTime: time(14, 57),
      endTime: time(15, 0),
      restReason: {
        id: 'a0A2800000FmMQCEA1',
        name: 'お昼休み',
        code: '001',
      },
    },
    {
      id: '0004',
      startTime: time(16, 0),
      endTime: time(17, 0),
      restReason: {
        id: 'a0A2800000FmMQCEA1',
        name: 'お昼休み',
        code: '001',
      },
    },
  ],
  restHours: null,
  otherRestReason: null,
  hasRestTime: false,
  commuteCount: {
    forwardCount: 0,
    backwardCount: 1,
  },
  remarks: 'REMARKS',
  maxRestTimesCount: 5,
};

export default dailyAttTime;
