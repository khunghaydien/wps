import React from 'react';

import DetailList from '../DetailList';
import dailyRecordList from './mock-data/dailyRecordList';
import nullDailyRecordList from './mock-data/nullDailyRecordList';

export default {
  title: 'attendance/timesheet-pc-objectively-event-log',
  parameters: {
    info: { propTables: [DetailList], inline: true, source: true },
  },
};

export const ObjectivelyEventLogDetailList = (): React.ReactElement => {
  return <DetailList dailyRecordList={dailyRecordList} />;
};

ObjectivelyEventLogDetailList.story = {
  name: 'objectivelyEventLogDetailList',
};

export const NullDetailList = (): React.ReactElement => {
  return <DetailList dailyRecordList={nullDailyRecordList} />;
};

NullDetailList.story = {
  name: 'nullDetailList',
};
