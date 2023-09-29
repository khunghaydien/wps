import * as React from 'react';
import { useSelector } from 'react-redux';

import { State } from '@apps/approvals-pc/modules';

import Component from '@apps/approvals-pc/components/attendance/AttDailyFixProcess/Detail/Content';

const ContentContainer: React.FC = () => {
  const selectedId = useSelector(
    (state: State) => state.ui.attFixDaily.selectedId
  );
  const request = useSelector((state: State) => state.ui.attFixDaily.request);
  const closingDate = useSelector(
    (state: State) =>
      state.ui.attFixDaily.records.originalRecords.find(
        ({ id }) => id === selectedId
      )?.requestDate
  );

  if (!selectedId || !request) {
    return null;
  }

  return <Component request={request} closingDate={closingDate} />;
};

export default ContentContainer;
