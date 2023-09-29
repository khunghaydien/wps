import { connect } from 'react-redux';

import DateUtil from '../../../commons/utils/DateUtil';

import {
  actions as uiActions,
  LIMIT_NUMBER,
} from '../../modules/delegateApplicant/ui/assignment';

import { State } from '../../reducers';

import EmployeesSearchDialog from '../../presentational-components/Employee/DelegateAssignment/EmployeesSearchDialog';

const mapStateToProps = (state: State) => ({
  foundEmployees: state.delegateApplicant.ui.assignment.foundEmployees,
  selectedEmployees: state.delegateApplicant.ui.assignment.selectedEmployees,
  excludedEmployees: state.delegateApplicant.ui.assignment.excludedEmployees,
  delegateAssignments: state.delegateApplicant.entities.assignment,
  currentEmpId: state.employee.entities.baseRecord.id,
  companyId: state.base.menuPane.ui.targetCompanyId,
});

const mapDispatchToProps = {
  cancel: uiActions.cancelEmployeeSelection,
  search: uiActions.searchEmployees,
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
    const excludedIds = [stateProps.currentEmpId].concat(excludedEmployees);
    dispatchProps.search(
      {
        ...query,
        primary: true,
        targetDate,
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
)(EmployeesSearchDialog) as React.ComponentType<Record<string, any>>;
