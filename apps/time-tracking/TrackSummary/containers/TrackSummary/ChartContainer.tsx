import React from 'react';
import { useSelector } from 'react-redux';

import { State } from '../../modules';

import Chart from '../../components/TrackSummary/Chart';

type OwnProps = Record<string, unknown>;

const ChartContainer = (_ownProps: OwnProps) => {
  const data = useSelector(
    (state: State) => state.entities.summary.content.taskSummaryRecords
  );

  return <Chart data={data} />;
};

export default ChartContainer;
