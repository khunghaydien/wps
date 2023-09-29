import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import {
  employeesSelector,
  searchEmployees,
} from '../../modules/annual-paid-leave-management/list-pane/entities/employee-list';
import { selectEmployee } from '../../modules/annual-paid-leave-management/list-pane/ui/employee-list';
import {
  updateDepartmentNameQuery,
  updateEmployeeCodeQuery,
  updateEmployeeNameQuery,
  updateTargetDateQuery,
  updateWorkingTypeNameQuery,
} from '../../modules/annual-paid-leave-management/list-pane/ui/search-form';

import ListPane from '../../presentational-components/AnnualPaidLeaveManagement/ListPane';

const ROW_LIMIT = 1000;

const mapStateToProps = (state) => ({
  targetCompanyId: state.base.menuPane.ui.targetCompanyId,
  employeeCodeQuery:
    state.annualPaidLeaveManagement.listPane.ui.searchForm.employeeCodeQuery,
  employeeNameQuery:
    state.annualPaidLeaveManagement.listPane.ui.searchForm.employeeNameQuery,
  departmentNameQuery:
    state.annualPaidLeaveManagement.listPane.ui.searchForm.departmentNameQuery,
  workingTypeNameQuery:
    state.annualPaidLeaveManagement.listPane.ui.searchForm.workingTypeNameQuery,
  targetDateQuery:
    state.annualPaidLeaveManagement.listPane.ui.searchForm.targetDateQuery,
  employees: employeesSelector(state),
  isOverLimit:
    state.annualPaidLeaveManagement.listPane.entities.employeeList.isOverLimit,
  isSearchExecuted:
    state.annualPaidLeaveManagement.listPane.ui.employeeList.isSearchExecuted,
  selectedEmployeeId:
    state.annualPaidLeaveManagement.listPane.ui.employeeList.selectedEmployeeId,
  targetDate:
    state.annualPaidLeaveManagement.listPane.ui.employeeList.targetDate,
  limit: ROW_LIMIT,
});

const mapDispatchToProps = (dispatch) => ({
  dispatch,
  ...bindActionCreators(
    {
      onChangeEmployeeCodeQuery: updateEmployeeCodeQuery,
      onChangeEmployeeNameQuery: updateEmployeeNameQuery,
      onChangeDepartmentNameQuery: updateDepartmentNameQuery,
      onChangeWorkingTypeNameQuery: updateWorkingTypeNameQuery,
      onChangeTargetDateQuery: updateTargetDateQuery,
      onSubmitSearchForm: searchEmployees,
      onClickEmployee: selectEmployee,
    },
    dispatch
  ),
});

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...stateProps,
  ...dispatchProps,
  ...ownProps,
  onSubmitSearchForm: () =>
    dispatchProps.onSubmitSearchForm({
      companyId: stateProps.targetCompanyId,
      employeeCodeQuery: stateProps.employeeCodeQuery,
      employeeNameQuery: stateProps.employeeNameQuery,
      departmentNameQuery: stateProps.departmentNameQuery,
      workingTypeNameQuery: stateProps.workingTypeNameQuery,
      targetDateQuery: stateProps.targetDateQuery,
      limitNumber: stateProps.limit,
    }),
  onClickEmployee: (employeeId) =>
    dispatchProps.onClickEmployee(employeeId, stateProps.targetDateQuery),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(ListPane);
