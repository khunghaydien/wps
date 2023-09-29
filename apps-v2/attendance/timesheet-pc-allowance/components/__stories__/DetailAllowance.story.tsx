import React from 'react';

import DetailAllowance from '../DetailAllowance';
import dailyAllowanceList from './mock-data/dailyAllowanceList';

export default {
  title: 'attendance/timesheet-pc-allowance',
  parameters: {
    info: { propTables: [DetailAllowance], inline: true, source: true },
  },
};

export const AllowanceDetail = (): React.ReactElement => {
  return (
    <DetailAllowance
      recordDate="2021-12-01"
      dailyAllowanceList={dailyAllowanceList}
    />
  );
};

AllowanceDetail.storyName = 'allowanceDetail';
