import { Response } from '../../fetch';

export const defaultValue: Response = {
  objectivelyEventLogList: [
    {
      id: 'XXXXXXXXXXXXXXX',
      objectivelyEventLogSettingCode: 'CODE001',
      eventType: 'Entering',
      eventTime: 570,
      importDateTime: '2022-01-10T09:30:00Z',
    },
    {
      id: 'XXXXXXXXXXXXXXX',
      objectivelyEventLogSettingCode: 'CODE001',
      eventType: 'Leaving',
      eventTime: 1110,
      importDateTime: '2022-01-10T18:30:00Z',
    },
    {
      id: 'XXXXXXXXXXXXXXX',
      objectivelyEventLogSettingCode: 'CODE002',
      eventType: 'Entering',
      eventTime: 600,
      importDateTime: '2022-01-10T10:00:00Z',
    },
  ],
};
