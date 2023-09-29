import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { grantHistoryRecordsSelector } from '../../modules/managed-leave-management/detail-pane/entities/grant-history-list';
import {
  execute,
  updateComment,
  updateDaysGranted,
  updateValidDateFrom,
  updateValidDateTo,
} from '../../modules/managed-leave-management/detail-pane/ui/new-grant-form';
import { selectedEmployeeSelector } from '../../modules/managed-leave-management/list-pane/entities/employee-list';
import { selectedLeaveTypeSelector } from '../../modules/managed-leave-management/list-pane/entities/leave-types';
import { deselectEmployee } from '../../modules/managed-leave-management/list-pane/ui/employee-list';
import { show } from '../../modules/managed-leave-management/update-dialog/ui';

import DetailPane from '../../presentational-components/ManagedLeaveManagement/DetailPane';

const mapStateToProps = (state) => {
  const targetEmployee = selectedEmployeeSelector(state);
  const targetLeaveType = selectedLeaveTypeSelector(state);

  return {
    targetEmployeeId: targetEmployee ? targetEmployee.id : null,
    targetEmployeeName: targetEmployee ? targetEmployee.name : null,
    targetLeaveTypeId: targetLeaveType ? targetLeaveType.id : null,
    targetLeaveTypeName: targetLeaveType ? targetLeaveType.name : null,
    daysGranted:
      state.managedLeaveManagement.detailPane.ui.newGrantForm.daysGranted,
    validDateFrom:
      state.managedLeaveManagement.detailPane.ui.newGrantForm.validDateFrom,
    validDateTo:
      state.managedLeaveManagement.detailPane.ui.newGrantForm.validDateTo,
    comment: state.managedLeaveManagement.detailPane.ui.newGrantForm.comment,
    grantHistoryList: grantHistoryRecordsSelector(state),
    grantHistoryRecordsById:
      state.managedLeaveManagement.detailPane.entities.grantHistoryList.byId,
    targetDate:
      state.managedLeaveManagement.listPane.ui.employeeList.targetDate,
  };
};

const mapDispatchToProps = (dispatch) => ({
  dispatch,
  ...bindActionCreators(
    {
      onClickCloseButton: deselectEmployee,
      onChangeDaysGranted: updateDaysGranted,
      onChangeValidDateFrom: updateValidDateFrom,
      onChangeValidDateTo: updateValidDateTo,
      onChangeComment: updateComment,
      onSubmitNewGrantForm: execute,
      onClickUpdateButton: show,
    },
    dispatch
  ),
});

const mergeProps = (stateProps, dispatchProps) => ({
  ...stateProps,
  ...dispatchProps,
  onSubmitNewGrantForm: () => {
    dispatchProps.onSubmitNewGrantForm(
      stateProps.targetEmployeeId,
      stateProps.targetLeaveTypeId,
      stateProps.daysGranted,
      stateProps.validDateFrom,
      stateProps.validDateTo,
      stateProps.targetDate,
      stateProps.comment
    );
  },
  onClickUpdateButton: (targetGrantHistoryRecordId) => {
    const targetGrantHistoryRecord =
      stateProps.grantHistoryRecordsById[targetGrantHistoryRecordId];

    dispatchProps.onClickUpdateButton(
      targetGrantHistoryRecordId,
      targetGrantHistoryRecord.validDateFrom,
      targetGrantHistoryRecord.validDateTo,
      targetGrantHistoryRecord.daysGranted
    );
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(DetailPane);
