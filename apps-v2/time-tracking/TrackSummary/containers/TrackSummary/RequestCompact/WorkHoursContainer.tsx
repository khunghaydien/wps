import React from 'react';
import { useSelector } from 'react-redux';

import { State } from '../../../modules';

import WorkHours from '../../../components/TrackSummary/RequestCompact/WorkHours';

type OwnProps = Record<string, unknown>;

const WorkHoursContainer = (_ownProps: OwnProps) => {
  const data = useSelector(
    (state: State) => state.entities.summary.content.taskSummaryRecords
  );
  return <WorkHours data={data} />;
};

export default WorkHoursContainer;
