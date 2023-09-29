import { ComponentProps } from 'react';

import Component from '../../DailyAttTimeDialog/Content';

const defaultValue: ComponentProps<typeof Component>['dailyAttTime'] = {
  recordId: 'recordId',
  recordDate: '2017-08-01',
  startTime: 540,
  endTime: 1080,
  restTimes: [
    {
      id: '0001',
      startTime: 781,
      endTime: 841,
      restReason: {
        id: '001',
        code: '001',
        name: '私用外出',
      },
    },
    {
      id: '0002',
      startTime: 782,
      endTime: 842,
      restReason: {
        id: '002',
        code: '002',
        name: 'お昼休み',
      },
    },
    {
      id: '0003',
      startTime: 783,
      endTime: 843,
      restReason: {
        id: '003',
        code: '003',
        name: '通院',
      },
    },
    {
      id: '0004',
      startTime: 784,
      endTime: 844,
      restReason: {
        id: '002',
        code: '002',
        name: 'お昼休み',
      },
    },
  ],
  restHours: null,
  otherRestReason: {
    id: '001',
    code: '001',
    name: '私用外出',
  },
  hasRestTime: false,
  commuteCount: {
    forwardCount: 0,
    backwardCount: 1,
  },
  remarks: 'remarks',
  maxRestTimesCount: 5,
};

export default defaultValue;
