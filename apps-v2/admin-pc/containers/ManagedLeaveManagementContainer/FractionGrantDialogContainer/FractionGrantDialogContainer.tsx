import React, { useMemo } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';

import { selectedEmployeeSelector } from '../../../modules/managed-leave-management/list-pane/entities/employee-list';
import { selectedLeaveTypeSelector } from '../../../modules/managed-leave-management/list-pane/entities/leave-types';

import { EventActions } from '../../../action-dispatchers/fraction-grant/event';
import FractionGrantDialog from '../../../presentational-components/ManagedLeaveManagement/FractionGrant/FractionGrantDialog';

const mapStateToProps = (state) => {
  const targetEmployee = selectedEmployeeSelector(state);
  const targetLeaveType = selectedLeaveTypeSelector(state);
  return {
    targetEmployeeId:
      targetEmployee !== null && targetEmployee !== undefined
        ? targetEmployee.id
        : null,
    targetLeaveTypeId: targetLeaveType ? targetLeaveType.id : null,
    isShowFractionDialog: state.fractionGrant.ui.isShowFractionDialog,
    detailEvent: state.fractionGrant.ui.detailEvent,
    tempEvent: state.fractionGrant.ui.tempEvent,
    targetDate:
      state.managedLeaveManagement.listPane.ui.employeeList.targetDate,
    targetGrantHistoryRecordId:
      state.fractionGrant.ui.targetGrantHistoryRecordId,
  };
};

const useMapDispatchToProps = () => {
  const dispatch = useDispatch();

  return useMemo(() => {
    const event = EventActions(dispatch);

    return {
      onCancel: event.setShowDialog,
      createManageLeaveFractionRecord: event.createManageLeaveFractionRecord,
      onUpdateValue: event.update,
      setEvent: event.setEvent,
    };
  }, [dispatch]);
};

const FractionGrantDialogContainer: React.FC = () => {
  const stateProps = useSelector(mapStateToProps, shallowEqual);
  const dispatchProps = useMapDispatchToProps();
  const onClickExecuteButton = () => {
    dispatchProps.createManageLeaveFractionRecord(
      stateProps.targetEmployeeId,
      stateProps.targetGrantHistoryRecordId,
      stateProps.tempEvent
    );
  };
  return (
    <FractionGrantDialog
      {...stateProps}
      {...dispatchProps}
      onClickExecuteButton={onClickExecuteButton}
    />
  );
};

export default FractionGrantDialogContainer;
