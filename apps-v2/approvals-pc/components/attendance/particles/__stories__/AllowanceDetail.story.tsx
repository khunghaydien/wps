import React from 'react';

import AllowanceDetail from '../AllowanceDetail';
import dailyAllowanceList from './mocks/dailyAllowanceList';

export default {
  title: 'approvals-pc/attendance/particles',
  parameters: {
    info: { propTables: [AllowanceDetail], inline: true, source: true },
  },
};

export const DetailAllowance = (): React.ReactElement => {
  return (
    <AllowanceDetail
      recordDate="2021-12-01"
      dailyAllowanceList={dailyAllowanceList}
    />
  );
};

DetailAllowance.storyName = 'detailAllowance';
