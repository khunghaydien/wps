import { connect } from 'react-redux';

import {
  actions as uiActionsDA,
  LIMIT_NUMBER,
} from '../../modules/ui/delegateApprover/assignment';

import EmployeesSearchDialog from '../../components/DelegateApprover/EmployeesSearchDialog';

const mapStateToProps = (state) => ({
  foundEmployees: state.ui.delegateApprover.assignment.foundEmployees,
  selectedEmployees: state.ui.delegateApprover.assignment.selectedEmployees,
  excludedEmployees: state.ui.delegateApprover.assignment.excludedEmployees,
  delegateAssignments: state.entities.delegateApprover.assignment,
  currentEmpId: state.userSetting.employeeId,
  companyId: state.userSetting.companyId,
});

const mapDispatchToProps = {
  cancel: uiActionsDA.cancelEmployeeSelection,
  search: uiActionsDA.searchEmployees,
  selectEmployees: uiActionsDA.selectEmployees,
};
const mergeProps = (stateProps, dispatchProps) => ({
  ...stateProps,
  ...dispatchProps,
  select: (employees) => dispatchProps.selectEmployees(employees),

  search: (query) => {
    const excludedEmployees = stateProps.excludedEmployees;
    const excludedIds = [stateProps.currentEmpId].concat(excludedEmployees);
    dispatchProps.search(
      {
        ...query,
        targetDate: new Date().toISOString().slice(0, 10),
        companyId: stateProps.companyId,
        limitNumber: LIMIT_NUMBER + excludedIds.length + 1,
      },
      excludedIds
    );
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(EmployeesSearchDialog);
