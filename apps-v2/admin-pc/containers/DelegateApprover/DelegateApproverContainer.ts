import { connect } from 'react-redux';

import { actions as actionsDA } from '../../modules/delegateApprover/entities/assignment';
import { actions as uiActionsDA } from '../../modules/delegateApprover/ui/assignment';

import { GRID_KEY } from '../../components/DelegateAssignment/AssignmentGrid';
import DelegateAssignemnt from '../../presentational-components/Employee/DelegateAssignment';

const mapStateToProps = (state) => ({
  target: GRID_KEY.APPROVER,
  isEmployeeSelection: state.delegateApprover.ui.assignment.isEmployeeSelection,
  isNewAssignment: state.delegateApprover.ui.assignment.isNewAssignment,
  delegateAssignments: state.delegateApprover.entities.assignment,
  selectedEmployees: state.delegateApprover.ui.assignment.selectedEmployees,
  employeeId: state.employee.entities.baseRecord.id,
});

const mapDispatchToProps = {
  save: actionsDA.save,
  list: actionsDA.list,
  openEmployeeSelection: uiActionsDA.openEmployeeSelection,
  cancelDA: uiActionsDA.cancelNewAssignment,
  removeDA: uiActionsDA.removeFromSelectedEmployees,
  removeFromExcludedEmployees: uiActionsDA.removeFromExcludedEmployees,
  selectEmployees: uiActionsDA.selectEmployees,
};

const mergeProps = (stateProps, dispatchProps) => ({
  ...stateProps,
  ...dispatchProps,
  select: (employees) => dispatchProps.selectEmployees(employees),
  openEmployeeSearchDialog: () => {
    dispatchProps.openEmployeeSelection(stateProps.openEmployeeSelection);
  },
  listDA: () => dispatchProps.list(stateProps.employeeId),
  saveDA: (delegateAssignments) => {
    dispatchProps
      .save(stateProps.employeeId, delegateAssignments)
      .then(() => dispatchProps.cancelDA());
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(DelegateAssignemnt);
