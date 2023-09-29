import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { deleteGrantedLeave } from '../../modules/managed-leave-management/detail-pane/entities/grant-history-list';
import { selectedEmployeeSelector } from '../../modules/managed-leave-management/list-pane/entities/employee-list';
import {
  execute,
  hide,
  updateNewDaysGranted,
} from '../../modules/managed-leave-management/update-dialog/ui';

import UpdateDialog from '../../presentational-components/ManagedLeaveManagement/UpdateDialog';

const mapStateToProps = (state) => {
  const targetEmployee = selectedEmployeeSelector(state);

  return {
    targetEmployeeId:
      targetEmployee !== null && targetEmployee !== undefined
        ? targetEmployee.id
        : null,
    targetLeaveTypeId:
      state.managedLeaveManagement.listPane.ui.leaveType.selectedLeaveTypeId,
    isVisible: state.managedLeaveManagement.updateDialog.ui.isVisible,
    targetGrantHistoryRecordId:
      state.managedLeaveManagement.updateDialog.ui.targetGrantHistoryRecordId,
    targetGrantHistoryRecordValidDateFrom:
      state.managedLeaveManagement.updateDialog.ui
        .targetGrantHistoryRecordValidDateFrom,
    targetGrantHistoryRecordValidDateTo:
      state.managedLeaveManagement.updateDialog.ui
        .targetGrantHistoryRecordValidDateTo,
    targetGrantHistoryRecordDaysGranted:
      state.managedLeaveManagement.updateDialog.ui
        .targetGrantHistoryRecordDaysGranted,
    targetDate:
      state.managedLeaveManagement.listPane.ui.employeeList.targetDate,
    newDaysGranted: state.managedLeaveManagement.updateDialog.ui.newDaysGranted,
  };
};
const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      onChangeNewDaysGranted: updateNewDaysGranted,
      onClickExecuteButton: execute,
      onClickCancelButton: hide,
      onClickDeleteButton: deleteGrantedLeave,
    },
    dispatch
  );

const mergeProps = (stateProps, dispatchProps) => ({
  ...stateProps,
  ...dispatchProps,
  onClickExecuteButton: () =>
    dispatchProps.onClickExecuteButton(
      stateProps.targetEmployeeId,
      stateProps.targetLeaveTypeId,
      stateProps.targetGrantHistoryRecordId,
      stateProps.newDaysGranted,
      stateProps.targetDate
    ),
  onClickDeleteButton: () =>
    dispatchProps.onClickDeleteButton(
      stateProps.targetGrantHistoryRecordId,
      stateProps.targetEmployeeId,
      stateProps.targetLeaveTypeId,
      stateProps.targetDate
    ),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(UpdateDialog);
