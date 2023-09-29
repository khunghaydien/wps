import React from 'react';

import DetailList from '../DetailList';
import dailyRecordList from './mock-data/dailyRecordList';
import nullDailyRecordList from './mock-data/nullDailyRecordList';

export default {
  title: 'attendance/timesheet-pc-allowance',
  parameters: {
    info: { propTables: [DetailList], inline: true, source: true },
  },
};

export const AllowanceDetailList = (): React.ReactElement => {
  return <DetailList dailyRecordList={dailyRecordList} />;
};

AllowanceDetailList.storyName = 'allowanceDetailList';

export const NullDetailList = (): React.ReactElement => {
  return <DetailList dailyRecordList={nullDailyRecordList} />;
};

NullDetailList.storyName = 'nullDetailList';
