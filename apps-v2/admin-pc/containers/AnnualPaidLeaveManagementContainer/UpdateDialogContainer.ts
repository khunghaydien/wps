import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { deleteGrantedPaidHoliday } from '../../modules/annual-paid-leave-management/detail-pane/entities/grant-history-list';
import { selectedEmployeeSelector } from '../../modules/annual-paid-leave-management/list-pane/entities/employee-list';
import {
  execute,
  hide,
  updateNewDaysGranted,
} from '../../modules/annual-paid-leave-management/update-dialog/ui';

import UpdateDialog from '../../presentational-components/AnnualPaidLeaveManagement/UpdateDialog';

const mapStateToProps = (state) => {
  const targetEmployee = selectedEmployeeSelector(state);

  return {
    targetEmployeeId:
      targetEmployee !== null && targetEmployee !== undefined
        ? targetEmployee.id
        : null,
    isVisible: state.annualPaidLeaveManagement.updateDialog.ui.isVisible,
    targetGrantHistoryRecordId:
      state.annualPaidLeaveManagement.updateDialog.ui
        .targetGrantHistoryRecordId,
    targetGrantHistoryRecordValidDateFrom:
      state.annualPaidLeaveManagement.updateDialog.ui
        .targetGrantHistoryRecordValidDateFrom,
    targetGrantHistoryRecordValidDateTo:
      state.annualPaidLeaveManagement.updateDialog.ui
        .targetGrantHistoryRecordValidDateTo,
    targetGrantHistoryRecordDaysGranted:
      state.annualPaidLeaveManagement.updateDialog.ui
        .targetGrantHistoryRecordDaysGranted,
    targetGrantHistoryRecordHoursGranted:
      state.annualPaidLeaveManagement.updateDialog.ui
        .targetGrantHistoryRecordHoursGranted,
    targetDate:
      state.annualPaidLeaveManagement.listPane.ui.employeeList.targetDate,
    newDaysGranted:
      state.annualPaidLeaveManagement.updateDialog.ui.newDaysGranted,
  };
};
const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      onChangeNewDaysGranted: updateNewDaysGranted,
      onClickExecuteButton: execute,
      onClickCancelButton: hide,
      onClickDeleteButton: deleteGrantedPaidHoliday,
    },
    dispatch
  );

const mergeProps = (stateProps, dispatchProps) => ({
  ...stateProps,
  ...dispatchProps,
  onClickExecuteButton: () =>
    dispatchProps.onClickExecuteButton(
      stateProps.targetEmployeeId,
      stateProps.targetGrantHistoryRecordId,
      stateProps.newDaysGranted,
      stateProps.targetDate
    ),
  onClickDeleteButton: () =>
    dispatchProps.onClickDeleteButton(
      stateProps.targetGrantHistoryRecordId,
      stateProps.targetEmployeeId,
      stateProps.targetDate
    ),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(UpdateDialog);
