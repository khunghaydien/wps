import React from 'react';

import Header from '../Header';

export default {
  title: 'attendance/timesheet-pc-objectively-event-log',
  parameters: {
    info: { propTables: [Header], inline: true, source: true },
  },
};

export const ObjectivelyEventLogHeader = (): React.ReactElement => {
  const ownerInfos = [
    {
      startDate: '2021-12-1',
      endDate: '2021-12-15',
      employee: {
        code: 'EMP_00',
        name: 'EMP_00',
      },
      department: {
        name: 'TEXエンジニアリング JP1サブチーム',
      },
      workingType: {
        name: 'コアタイム(11:00～16:00)',
      },
    },
    {
      startDate: '2021-12-16',
      endDate: '2021-12-31',
      employee: {
        code: 'EMP_00',
        name: 'EMP_00',
      },
      department: {
        name: 'TEXT2',
      },
      workingType: {
        name: 'FIX02',
      },
    },
  ];
  return <Header period="202112" ownerInfos={ownerInfos} />;
};

ObjectivelyEventLogHeader.story = {
  name: 'objectivelyEventLogHeader',
};
