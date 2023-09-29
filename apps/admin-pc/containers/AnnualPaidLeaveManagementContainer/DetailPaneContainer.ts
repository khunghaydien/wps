import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { grantHistoryRecordsSelector } from '../../modules/annual-paid-leave-management/detail-pane/entities/grant-history-list';
import {
  execute,
  updateComment,
  updateDaysGranted,
  updateValidDateFrom,
  updateValidDateTo,
} from '../../modules/annual-paid-leave-management/detail-pane/ui/new-grant-form';
import { selectedEmployeeSelector } from '../../modules/annual-paid-leave-management/list-pane/entities/employee-list';
import { deselectEmployee } from '../../modules/annual-paid-leave-management/list-pane/ui/employee-list';
import { show } from '../../modules/annual-paid-leave-management/update-dialog/ui';

import DetailPane from '../../presentational-components/AnnualPaidLeaveManagement/DetailPane';

const mapStateToProps = (state) => {
  const targetEmployee = selectedEmployeeSelector(state);

  return {
    targetEmployeeId: targetEmployee ? targetEmployee.id : null,
    targetEmployeeName: targetEmployee ? targetEmployee.name : null,
    daysGranted:
      state.annualPaidLeaveManagement.detailPane.ui.newGrantForm.daysGranted,
    validDateFrom:
      state.annualPaidLeaveManagement.detailPane.ui.newGrantForm.validDateFrom,
    validDateTo:
      state.annualPaidLeaveManagement.detailPane.ui.newGrantForm.validDateTo,
    comment: state.annualPaidLeaveManagement.detailPane.ui.newGrantForm.comment,
    grantHistoryList: grantHistoryRecordsSelector(state),
    grantHistoryRecordsById:
      state.annualPaidLeaveManagement.detailPane.entities.grantHistoryList.byId,
    targetDate:
      state.annualPaidLeaveManagement.listPane.ui.employeeList.targetDate,
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
