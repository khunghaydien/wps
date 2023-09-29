import React from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { bindActionCreators } from 'redux';

import { changeRecordfetatureByIndex } from '@apps/admin-pc/action-dispatchers/feature-setting/detail';

import OpsRecordAggregateList from '../../presentational-components/AttendanceFeatureSetting/MainContents/DetailPane/OpsRecordAggregateList';

type Props = {
  disabled: boolean;
  sfObjFieldValues: any;
};

const mapStateToProps = (state) => ({
  searchAttOpsRecord: state.searchAttOpsRecord,
  tempOpsRecordAggregate: state.featureSetting.ui.detail.TempOpsRecordAggregate,
  tmpEditRecordHistoryId: state.tmpEditRecordHistory.id,
});

const useMapDispatchToProps = () => {
  const dispatch = useDispatch();
  return {
    ...bindActionCreators(
      {
        changeRecordfetatureByIndex,
      },
      dispatch
    ),
  };
};

const OpsRecordAggregateListContainer: React.FC<Props> = ({
  disabled,
  sfObjFieldValues,
}) => {
  const dispatchProps = useMapDispatchToProps();
  const stateProps = useSelector(mapStateToProps, shallowEqual);
  return (
    <OpsRecordAggregateList
      disabled={disabled}
      sfObjFieldValues={sfObjFieldValues}
      {...stateProps}
      {...dispatchProps}
    />
  );
};

export default OpsRecordAggregateListContainer;
