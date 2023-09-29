import { connect } from 'react-redux';

import DateUtil from '../../../commons/utils/DateUtil';

import {
  actions as uiActionsDA,
  LIMIT_NUMBER,
} from '../../modules/delegateApprover/ui/assignment';

import { State } from '../../reducers';

import EmployeesSearchDialog from '../../presentational-components/Employee/DelegateAssignment/EmployeesSearchDialog';

const mapStateToProps = (state: State) => ({
  foundEmployees: state.delegateApprover.ui.assignment.foundEmployees,
  selectedEmployees: state.delegateApprover.ui.assignment.selectedEmployees,
  excludedEmployees: state.delegateApprover.ui.assignment.excludedEmployees,
  delegateAssignments: state.delegateApprover.entities.assignment,
  currentEmpId: state.employee.entities.baseRecord.id,
  companyId: state.base.menuPane.ui.targetCompanyId,
});

const mapDispatchToProps = {
  cancel: uiActionsDA.cancelEmployeeSelection,
  search: uiActionsDA.searchEmployees,
  reset: uiActionsDA.clearFoundEmployees,
};
const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...stateProps,
  ...dispatchProps,
  ...ownProps,
  targetDate: ownProps.targetDate || DateUtil.getToday(),
  cancel: () => {
    if (ownProps.cancel) {
      ownProps.cancel();
    }
    dispatchProps.cancel();
  },
  search: (query) => {
    const targetDate =
      query.targetDate || ownProps.targetDate || DateUtil.getToday();
    const excludedEmployees =
      ownProps.excludedEmployees || stateProps.excludedEmployees;
    dispatchProps.search(
      {
        ...query,
        targetDate,
        companyId: ownProps.companyId || stateProps.companyId,
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
