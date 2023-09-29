import React from 'react';

import RestReasonTable from '../RestReasonTable';
import dailyRestRecordList from './mocks/dailyRestRecordList';
import nullDailyRestRecordList from './mocks/nullDailyRestRecordList';

export default {
  title: 'approvals-pc/attendance/particles/RestReasonTable',
  parameters: {
    info: { propTables: [RestReasonTable], inline: true, source: true },
  },
};

export const RestDetailList = (): React.ReactElement => {
  return <RestReasonTable dailyRestRecordList={dailyRestRecordList} />;
};

RestDetailList.storyName = 'restDetailList';

export const NullRestDetailList = (): React.ReactElement => {
  return <RestReasonTable dailyRestRecordList={nullDailyRestRecordList} />;
};

NullRestDetailList.storyName = 'nullRestDetailList';
