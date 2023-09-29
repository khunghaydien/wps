import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { selectors as selectionUISelectors } from '../../modules/adminCommon/employeeSelection/ui/selection';
import { actions as leaveOfAbsencePeriodStatusListActions } from '../../modules/leaveOfAbsencePeriodStatus/entities/leaveOfAbsencePeriodStatusList';
import { actions as editingUIActions } from '../../modules/leaveOfAbsencePeriodStatus/ui/editingUpdatePeriodStatus';

import UpdatePeriodStatusDialog from '../../presentational-components/LeaveOfAbsencePeriodStatus/UpdatePeriodStatusDialog';

const mapStateToProps = (state) => ({
  targetEmployee: selectionUISelectors.selectSelectedEmployee(state),
  leaveOfAbsenceList:
    state.leaveOfAbsencePeriodStatus.entities.leaveOfAbsenceList,
  editingLeaveOfAbsencePeriodStatus:
    state.leaveOfAbsencePeriodStatus.ui.editingUpdatePeriodStatus,
});

const mapDispatchToProps = (dispatch) => ({
  onUpdateValue: bindActionCreators(editingUIActions.update, dispatch),
  onCancel: bindActionCreators(editingUIActions.unset, dispatch),
  onSubmit: (stateProps, dispatchProps) =>
    dispatch(
      editingUIActions.save(
        stateProps.targetEmployee.id,
        stateProps.editingLeaveOfAbsencePeriodStatus,
        () => dispatchProps.onExecutionSuccess(stateProps)
      )
    ),
  onClickDeleteButton: (stateProps, dispatchProps) =>
    dispatch(
      editingUIActions.delete(
        stateProps.editingLeaveOfAbsencePeriodStatus,
        () => dispatchProps.onExecutionSuccess(stateProps)
      )
    ),
  onExecutionSuccess: (stateProps) =>
    dispatch(
      leaveOfAbsencePeriodStatusListActions.fetch(stateProps.targetEmployee.id)
    ),
});

const mergeProps = (stateProps, dispatchProps) => ({
  ...stateProps,
  ...dispatchProps,
  onSubmit: () => dispatchProps.onSubmit(stateProps, dispatchProps),
  onClickDeleteButton: () =>
    dispatchProps.onClickDeleteButton(stateProps, dispatchProps),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(UpdatePeriodStatusDialog);
