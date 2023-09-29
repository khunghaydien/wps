import React from 'react';
import { useSelector } from 'react-redux';

import { State } from '../../modules';

import Period from '../../components/TrackSummary/Period';

type OwnProps = Record<string, unknown>;

const PeriodContainer = (_ownProps: OwnProps) => {
  const endDate = useSelector(
    (state: State) => state.entities.summary.content.endDate
  );
  const startDate = useSelector(
    (state: State) => state.entities.summary.content.startDate
  );
  return <Period endDate={endDate} startDate={startDate} />;
};

export default PeriodContainer;
