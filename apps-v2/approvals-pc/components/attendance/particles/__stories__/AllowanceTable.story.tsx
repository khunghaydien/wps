import React from 'react';

import AllowanceTable from '../AllowanceTable';
import dailyAllowanceRecordList from './mocks/dailyAllowanceRecordList';
import nullDailyAllowanceRecordList from './mocks/nullDailyAllowanceRecordList';

export default {
  title: 'approvals-pc/attendance/particles/AllowanceTable',
  parameters: {
    info: { propTables: [AllowanceTable], inline: true, source: true },
  },
};

export const AllowanceDetailList = (): React.ReactElement => {
  return <AllowanceTable dailyAllowanceRecordList={dailyAllowanceRecordList} />;
};

AllowanceDetailList.storyName = 'allowanceDetailList';

export const NullAllowanceDetailList = (): React.ReactElement => {
  return (
    <AllowanceTable dailyAllowanceRecordList={nullDailyAllowanceRecordList} />
  );
};

NullAllowanceDetailList.storyName = 'nullAllowanceDetailList';
