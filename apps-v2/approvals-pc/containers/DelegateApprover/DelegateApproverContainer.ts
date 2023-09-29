import { connect } from 'react-redux';

import { actions as uiCommonAction } from '../../../commons/modules/delegateApprovalDialog';

import { actions as actionsDA } from '../../modules/entities/delegateApprover/assignment';
import { actions as uiActionsDA } from '../../modules/ui/delegateApprover/assignment';

import DelegateAssignemnt from '../../components/DelegateApprover/DelegateAssignment';

const mapStateToProps = (state) => ({
  isEmployeeSelection: state.ui.delegateApprover.assignment.isEmployeeSelection,
  isShowDADialog: state.common.delegateApprovalDialog.isNewAssignment,
  delegateAssignments: state.entities.delegateApprover.assignment,
  selectedEmployees: state.ui.delegateApprover.assignment.selectedEmployees,
  employeeId: state.common.userSetting.employeeId,
});

const mapDispatchToProps = {
  save: actionsDA.save,
  list: actionsDA.list,
  openEmployeeSelection: uiActionsDA.openEmployeeSelection,
  openNewAssignment: uiCommonAction.openNewAssignment,
  removeDA: uiActionsDA.removeFromSelectedEmployees,
  removeFromExcludedEmployees: uiActionsDA.removeFromExcludedEmployees,
};

const mergeProps = (stateProps, dispatchProps) => ({
  ...stateProps,
  ...dispatchProps,
  openEmployeeSearchDialog: () => {
    dispatchProps.openEmployeeSelection(stateProps.openEmployeeSelection);
  },
  listDA: () => dispatchProps.list(stateProps.employeeId),
  saveDA: (delegateAssignments) => {
    dispatchProps
      .save(stateProps.employeeId, delegateAssignments)
      .then(() => dispatchProps.openNewAssignment(false));
  },
  cancelDA: () => {
    dispatchProps.openNewAssignment(false);
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(DelegateAssignemnt) as React.ComponentType<Record<string, any>>;
