import React from 'react';

import ObjectivelyEvnetLogDetail from '../DetailObjectivelyEvnetLog';
import ObjectivelyEventLogDailyRecord from './mock-data/dailyObjectivelyEvnetLog';

export default {
  title: 'attendance/timesheet-pc-objectively-event-log',
  parameters: {
    info: {
      propTables: [ObjectivelyEvnetLogDetail],
      inline: true,
      source: true,
    },
  },
};

export const ObjectivelyEventLogDetail = (): React.ReactElement => {
  return (
    <ObjectivelyEvnetLogDetail
      recordDate="2021-12-01"
      dailyRecordItem={ObjectivelyEventLogDailyRecord}
    />
  );
};

ObjectivelyEventLogDetail.story = {
  name: 'objectivelyEventLogDetail',
};
