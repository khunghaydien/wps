import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import {
  actions as selectionUIActions,
  selectors as selectionUISelectors,
} from '../../modules/adminCommon/employeeSelection/ui/selection';
import { actions as editingEntryUIActions } from '../../modules/leaveOfAbsencePeriodStatus/ui/editingEntryPeriodStatus';
import { actions as editingUpdateUIActions } from '../../modules/leaveOfAbsencePeriodStatus/ui/editingUpdatePeriodStatus';

import DetailPane from '../../presentational-components/LeaveOfAbsencePeriodStatus/DetailPane';

const mapStateToProps = (state) => ({
  targetEmployee: selectionUISelectors.selectSelectedEmployee(state),
  leaveOfAbsenceList:
    state.leaveOfAbsencePeriodStatus.entities.leaveOfAbsenceList,
  leaveOfAbsencePeriodStatusList:
    state.leaveOfAbsencePeriodStatus.entities.leaveOfAbsencePeriodStatusList,
  editingLeaveOfAbsencePeriodStatus:
    state.leaveOfAbsencePeriodStatus.ui.editingEntryPeriodStatus,
});

const mapDispatchToProps = (dispatch) => ({
  onUpdateEntryFormValue: bindActionCreators(
    editingEntryUIActions.update,
    dispatch
  ),
  onClickEditHistoryButton: bindActionCreators(
    editingUpdateUIActions.set,
    dispatch
  ),
  onClickCloseButton: () => {
    dispatch(editingEntryUIActions.clear());
    dispatch(selectionUIActions.clear());
  },
  onSubmitEntryForm: (stateProps) =>
    dispatch(
      editingEntryUIActions.save(
        stateProps.targetEmployee.id,
        stateProps.editingLeaveOfAbsencePeriodStatus
      )
    ),
});

const mergeProps = (stateProps, dispatchProps) => ({
  ...stateProps,
  ...dispatchProps,
  onSubmitEntryForm: () =>
    dispatchProps.onSubmitEntryForm(stateProps, dispatchProps),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(DetailPane);
