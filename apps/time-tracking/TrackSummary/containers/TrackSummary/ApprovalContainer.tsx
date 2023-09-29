import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { State } from '../../modules/index';

import Approval from '../../action-dispatchers/Approval';

import TrackSummary from '../../components/TrackSummary';

type OwnProps = Readonly<{
  id: string;
}>;

const mapStateToProps = (state: State) => ({
  data: state.entities.requestSummary.taskSummaryRecords,
  startDate: state.entities.requestSummary.startDate,
  endDate: state.entities.requestSummary.endDate,
});

const ApprovalContainer = (ownProps: OwnProps) => {
  const props = useSelector(mapStateToProps);

  const dispatch = useDispatch();
  useEffect(() => {
    Approval(dispatch).initialize(ownProps.id);
  }, [ownProps.id]);

  return <TrackSummary.Approval {...props} />;
};

export default ApprovalContainer;
