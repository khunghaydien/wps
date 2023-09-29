import React, { useMemo } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';

import { selectedEmployeeSelector } from '../../../modules/annual-paid-leave-management/list-pane/entities/employee-list';

import { EventActions } from '../../../action-dispatchers/fraction-grant/event';
import GrantSuccessMessage from '@apps/admin-pc/presentational-components/AnnualPaidLeaveManagement/FractionGrant/GrantSuccessMessage';

const mapStateToProps = (state) => {
  const targetEmployee = selectedEmployeeSelector(state);
  return {
    isShowSuccessMessage: state.fractionGrant.ui.isShowSuccessMessage,
    targetEmployeeId:
      targetEmployee !== null && targetEmployee !== undefined
        ? targetEmployee.id
        : null,
    targetDate:
      state.annualPaidLeaveManagement.listPane.ui.employeeList.targetDate,
  };
};

const useMapDispatchToProps = () => {
  const dispatch = useDispatch();

  return useMemo(() => {
    const event = EventActions(dispatch);

    return {
      setShowSuccessMessage: event.setShowSuccessMessage,
      flushGrantHistList: event.flushAnnualLeaveHistory,
    };
  }, [dispatch]);
};

const GrantSuccessMessageContainer: React.FC = () => {
  const stateProps = useSelector(mapStateToProps, shallowEqual);
  const dispatchProps = useMapDispatchToProps();
  const flushGrantHistList = () => {
    dispatchProps.flushGrantHistList(
      stateProps.targetEmployeeId,
      stateProps.targetDate
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
