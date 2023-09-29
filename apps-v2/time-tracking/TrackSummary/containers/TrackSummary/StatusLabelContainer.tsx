import React from 'react';
import { useSelector } from 'react-redux';

import { State } from '../../modules';

import StatusLabel from '../../components/TrackSummary/StatusLabel';

type OwnProps = Record<string, unknown>;

const StatusLabelContainer = (_ownProps: OwnProps) => {
  const status = useSelector(
    (state: State) => state.entities.summary.content.request.status
  );
  return <StatusLabel status={status} />;
};

export default StatusLabelContainer;
