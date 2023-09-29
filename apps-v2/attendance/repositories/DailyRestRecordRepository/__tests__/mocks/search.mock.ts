import { Response } from '../../search';

export const defaultValue: Response = {
  dailyRestList: [
    {
      recordDate: '2022-07-01',
      dailyRestList: [
        {
          id: 'XXXXXXXXXXXXXXX',
          restReasonId: 'XXXXXXXXXXXXXXX',
          restReasonName: 'TestName',
          restReasonCode: 'TestCode',
          outStartTime: 1080,
          outEndTime: 1200,
          outRestTime: 120,
        },
      ],
    },
  ],
};
