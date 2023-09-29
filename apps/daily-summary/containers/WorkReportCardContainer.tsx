import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { State } from '../modules';
import { actions } from '../modules/ui/dailySummary';

import WorkReportCard from '../components/WorkReportCard';

import { useACL } from './hooks/useACL';

const WorkReportCardContainer = () => {
  const { editTimeTrack } = useACL();

  const workReport = useSelector(
    (state: State) => state.ui.dailySummary.note || ''
  );

  const isLoading = useSelector(
    (state: State) => (state.common as any).app.loadingDepth > 0
  );

  const dispatch = useDispatch();
  const onChange = React.useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      dispatch(actions.update('note', e.currentTarget.value));
    },
    [dispatch]
  );

  return (
    // It waits for the remote data because it decide whether to open the card by default.
    !isLoading && (
      <WorkReportCard
        defaultOpen={!!workReport}
        value={workReport}
        onChange={onChange}
        readOnly={!editTimeTrack}
      />
    )
  );
};

export default WorkReportCardContainer;
