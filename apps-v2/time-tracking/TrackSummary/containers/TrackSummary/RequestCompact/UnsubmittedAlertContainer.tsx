import React from 'react';
import { useSelector } from 'react-redux';

import { State } from '../../../modules';

import UnsubmittedAlert from '../../../components/TrackSummary/RequestCompact/UnsubmittedAlert';

const UnsubmittedAlertContainer = () => {
  const requestAlert = useSelector(
    (state: State) => state.entities.requestAlert
  );

  return <UnsubmittedAlert requestAlert={requestAlert} />;
};

export default UnsubmittedAlertContainer;
