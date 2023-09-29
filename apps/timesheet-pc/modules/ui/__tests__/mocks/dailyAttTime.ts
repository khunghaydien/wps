import { DailyAttTime } from '../../../../../domain/models/attendance/DailyAttTime';

const dailyAttTime: DailyAttTime = {
  recordDate: '2020-04-16',
  startTime: '12:00',
  endTime: '13:00',
  startStampTime: '',
  endStampTime: '',
  restTimes: [
    {
      start: '12:00',
      end: '13:00',
    },
    {
      start: '13:42',
      end: '14:56',
    },
    {
      start: '14:57',
      end: '15:00',
    },
    {
      start: '16:00',
      end: '17:00',
    },
  ],
  restHours: null,
  insufficientRestTime: 0,
  hasRestTime: false,
};

export default dailyAttTime;
