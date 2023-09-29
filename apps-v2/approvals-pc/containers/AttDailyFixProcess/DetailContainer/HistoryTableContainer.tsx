import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { State } from '@apps/approvals-pc/modules';

import initialize from '@apps/approvals-pc/action-dispatchers/History';

import Component from '@apps/approvals-pc/components/DetailParts/HistoryTable';

const HistoryTableContainer: React.FC<{
  requestId: string;
}> = ({ requestId }) => {
  const dispatch = useDispatch();
  const historyList = useSelector((state: State) => state.entities.histories);
  const actions = React.useMemo(() => initialize(dispatch), [dispatch]);
  React.useEffect(() => {
    actions.fetch(requestId);
  }, [actions, requestId]);
  return <Component historyList={[...historyList]} />;
};

export default HistoryTableContainer;
