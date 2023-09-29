import React, { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Status } from '../../../../../domain/models/approval/request/Status';

import { State } from '../../../modules';

import Request from '../../../action-dispatchers/Request';

import ApprovalHistoryButton from '../../../components/TrackSummary/RequestCompact/ApprovalHistoryButton';

const ApprovalHistoryButtonContainer = () => {
  const requestId = useSelector<State, string>(
    (state) => state.entities.summary.content.request.requestId
  );
  const status = useSelector<State, Status>(
    (state) => state.entities.summary.content.request.status
  );

  const dispatch = useDispatch();
  const request = useMemo(() => Request(dispatch), [dispatch]);

  const onClick = useCallback(() => {
    request.openHistoryDialog(requestId);
  }, [requestId, request]);

  return <ApprovalHistoryButton onClick={onClick} status={status} />;
};

export default ApprovalHistoryButtonContainer;
