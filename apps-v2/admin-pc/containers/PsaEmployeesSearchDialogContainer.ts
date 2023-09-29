import { connect } from 'react-redux';

import DateUtil from '../../commons/utils/DateUtil';

import {
  actions as uiActionsDA,
  LIMIT_NUMBER,
} from '../modules/delegateApprover/ui/assignment';

import { State } from '../reducers';

import EmployeesSearchDialog from '../presentational-components/Employee/DelegateAssignment/EmployeesSearchDialog';

const mapStateToProps = (state: State) => {
  const excludedEmployees =
    state.searchTalentProfile && state.searchTalentProfile.map((_) => _.empId);

  return {
    excludedEmployees,
    foundEmployees: state.delegateApprover.ui.assignment.foundEmployees,
    selectedEmployees: state.delegateApprover.ui.assignment.selectedEmployees,
    delegateAssignments: state.delegateApprover.entities.assignment,
    currentEmpId: state.employee.entities.baseRecord.id,
    companyId: state.base.menuPane.ui.targetCompanyId,
  };
};

const mapDispatchToProps = {
  cancel: uiActionsDA.cancelEmployeeSelection,
  search: uiActionsDA.searchEmployees,
};
const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...ownProps,
  ...stateProps,
  ...dispatchProps,
  targetDate: ownProps.targetDate || DateUtil.getToday(),
  search: (query) => {
    const targetDate =
      query.targetDate || ownProps.targetDate || DateUtil.getToday();
    const excludedEmployees = stateProps.excludedEmployees;
    dispatchProps.search(
      {
        ...query,
        targetDate,
        companyId: stateProps.companyId,
        limitNumber: LIMIT_NUMBER + excludedEmployees.length + 1,
      },
      excludedEmployees
    );
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(EmployeesSearchDialog) as React.ComponentType<Record<string, any>>;
