import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import {
  employeesSelector,
  searchEmployees,
} from '../../modules/managed-leave-management/list-pane/entities/employee-list';
import { leaveTypesSelector } from '../../modules/managed-leave-management/list-pane/entities/leave-types';
import { selectEmployee } from '../../modules/managed-leave-management/list-pane/ui/employee-list';
import { changeLeaveType } from '../../modules/managed-leave-management/list-pane/ui/leave-type';
import {
  updateDepartmentNameQuery,
  updateEmployeeCodeQuery,
  updateEmployeeNameQuery,
  updateTargetDateQuery,
  updateWorkingTypeNameQuery,
} from '../../modules/managed-leave-management/list-pane/ui/search-form';

import ListPane from '../../presentational-components/ManagedLeaveManagement/ListPane';

const ROW_LIMIT = 1000;

const mapStateToProps = (state) => ({
  targetCompanyId: state.base.menuPane.ui.targetCompanyId,
  selectedLeaveTypeId:
    state.managedLeaveManagement.listPane.ui.leaveType.selectedLeaveTypeId,
  leaveTypes: leaveTypesSelector(state),
  employeeCodeQuery:
    state.managedLeaveManagement.listPane.ui.searchForm.employeeCodeQuery,
  employeeNameQuery:
    state.managedLeaveManagement.listPane.ui.searchForm.employeeNameQuery,
  departmentNameQuery:
    state.managedLeaveManagement.listPane.ui.searchForm.departmentNameQuery,
  workingTypeNameQuery:
    state.managedLeaveManagement.listPane.ui.searchForm.workingTypeNameQuery,
  targetDateQuery:
    state.managedLeaveManagement.listPane.ui.searchForm.targetDateQuery,
  employees: employeesSelector(state),
  isOverLimit:
    state.managedLeaveManagement.listPane.entities.employeeList.isOverLimit,
  isSearchExecuted:
    state.managedLeaveManagement.listPane.ui.employeeList.isSearchExecuted,
  selectedEmployeeId:
    state.managedLeaveManagement.listPane.ui.employeeList.selectedEmployeeId,
  targetDate: state.managedLeaveManagement.listPane.ui.employeeList.targetDate,
  limit: ROW_LIMIT,
});

const mapDispatchToProps = (dispatch) => ({
  dispatch,
  ...bindActionCreators(
    {
      onChangeLeaveType: changeLeaveType,
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
      leaveTypeId: stateProps.selectedLeaveTypeId,
      employeeCodeQuery: stateProps.employeeCodeQuery,
      employeeNameQuery: stateProps.employeeNameQuery,
      departmentNameQuery: stateProps.departmentNameQuery,
      workingTypeNameQuery: stateProps.workingTypeNameQuery,
      targetDateQuery: stateProps.targetDateQuery,
      limitNumber: stateProps.limit,
    }),
  onClickEmployee: (selectedEmployeeId) => {
    dispatchProps.onClickEmployee(
      selectedEmployeeId,
      stateProps.selectedLeaveTypeId,
      stateProps.targetDateQuery
    );
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(ListPane);
