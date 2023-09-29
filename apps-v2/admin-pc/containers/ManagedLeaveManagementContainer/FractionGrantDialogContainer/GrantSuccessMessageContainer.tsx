import React, { useMemo } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';

import { selectedEmployeeSelector } from '../../../modules/managed-leave-management/list-pane/entities/employee-list';
import { selectedLeaveTypeSelector } from '../../../modules/managed-leave-management/list-pane/entities/leave-types';

import { EventActions } from '../../../action-dispatchers/fraction-grant/event';
import GrantSuccessMessage from '@apps/admin-pc/presentational-components/ManagedLeaveManagement/FractionGrant/GrantSuccessMessage';

const mapStateToProps = (state) => {
  const targetEmployee = selectedEmployeeSelector(state);
  const targetLeaveType = selectedLeaveTypeSelector(state);
  return {
    isShowSuccessMessage: state.fractionGrant.ui.isShowSuccessMessage,
    targetLeaveTypeId: targetLeaveType ? targetLeaveType.id : null,
    targetEmployeeId:
      targetEmployee !== null && targetEmployee !== undefined
        ? targetEmployee.id
        : null,
    targetDate:
      state.managedLeaveManagement.listPane.ui.employeeList.targetDate,
  };
};

const useMapDispatchToProps = () => {
  const dispatch = useDispatch();

  return useMemo(() => {
    const event = EventActions(dispatch);

    return {
      setShowSuccessMessage: event.setShowSuccessMessage,
      flushGrantHistList: event.flushManageLeaveHistory,
    };
  }, [dispatch]);
};

const GrantSuccessMessageContainer: React.FC = () => {
  const stateProps = useSelector(mapStateToProps, shallowEqual);
  const dispatchProps = useMapDispatchToProps();
  const flushGrantHistList = () => {
    dispatchProps.flushGrantHistList(
      stateProps.targetEmployeeId,
      stateProps.targetDate,
      stateProps.targetLeaveTypeId
    );
  };
  return (
    <GrantSuccessMessage
      {...stateProps}
      {...dispatchProps}
      flushGrantHistList={flushGrantHistList}
    />
  );
};

export default GrantSuccessMessageContainer;
