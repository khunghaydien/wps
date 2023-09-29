import React from 'react';

import RestReasonDetail from '../RestReasonDetail';
import restRecord from './mocks/RestRecord';

export default {
  title: 'approvals-pc/attendance/particles/RestReasonDetail',
  parameters: {
    info: { propTables: [RestReasonDetail], inline: true, source: true },
  },
};

export const DetailRest = (): React.ReactElement => {
  return (
    <RestReasonDetail
      recordDate="2022-07-04"
      restRecords={restRecord}
      mdw={true}
    />
  );
};

DetailRest.storyName = 'detailRest';
