import { connect } from 'react-redux';

import { actions } from '../../modules/delegateApplicant/entities/assignment';
import { actions as uiActions } from '../../modules/delegateApplicant/ui/assignment';

import { GRID_KEY } from '../../components/DelegateAssignment/AssignmentGrid';
import DelegateAssignemnt from '../../presentational-components/Employee/DelegateAssignment';

const mapStateToProps = (state) => ({
  target: GRID_KEY.APPLICANT,
  isEmployeeSelection:
    state.delegateApplicant.ui.assignment.isEmployeeSelection,
  isNewAssignment: state.delegateApplicant.ui.assignment.isNewAssignment,
  delegateAssignments: state.delegateApplicant.entities.assignment,
  selectedEmployees: state.delegateApplicant.ui.assignment.selectedEmployees,
  employeeId: state.employee.entities.baseRecord.id,
});

const mapDispatchToProps = {
  save: actions.save,
  list: actions.list,
  openEmployeeSelection: uiActions.openEmployeeSelection,
  cancelDA: uiActions.cancelNewAssignment,
  removeDA: uiActions.removeFromSelectedEmployees,
  removeFromExcludedEmployees: uiActions.removeFromExcludedEmployees,
  selectEmployees: uiActions.selectEmployees,
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
    const settings = delegateAssignments.map((x) => ({
      settingId: x.settingId,
      delegateeId: x.delegatee.id,
      delegatedFor: x.delegatedFor,
    }));
    dispatchProps
      .save(stateProps.employeeId, settings)
      .then(() => dispatchProps.cancelDA());
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(DelegateAssignemnt);
