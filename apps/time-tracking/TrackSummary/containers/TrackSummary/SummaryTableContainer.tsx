import React from 'react';
import { useSelector } from 'react-redux';

import { State } from '../../modules';

import SummaryTable, {
  ColumnDef,
} from '../../components/TrackSummary/SummaryTable';

export { Column } from '../../components/TrackSummary/SummaryTable';

type OwnProps = {
  column: () => ColumnDef;
};

const SummaryTableContainer = (ownProps: OwnProps) => {
  const data = useSelector(
    (state: State) => state.entities.summary.content.taskSummaryRecords
  );

  return <SummaryTable data={data} {...ownProps} />;
};

export default SummaryTableContainer;
