import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { buildFetchQuery } from '../../models/common/EmployeePersonalInfo';

import { actions as employeeListEntityActions } from '../../modules/adminCommon/employeeSelection/entities/employeeList';
import { actions as searchConditionUIActions } from '../../modules/adminCommon/employeeSelection/ui/searchCondition';
import { actions as selectionUIActions } from '../../modules/adminCommon/employeeSelection/ui/selection';
import { actions as editingEntryPeriodStatusUIActions } from '../../modules/shortTimeWorkPeriodStatus/ui/editingEntryPeriodStatus';

import ListPane from '../../presentational-components/ShortTimeWorkPeriodStatus/ListPane';

const ROW_LIMIT = 1000;

const mapStateToProps = (state) => {
  const { searchCondition } = state.adminCommon.employeeSelection.ui;
  return {
    limit: ROW_LIMIT,
    employees: state.adminCommon.employeeSelection.entities.employeeList.list,
    isOverLimit:
      state.adminCommon.employeeSelection.entities.employeeList.isOverLimit,
    selectedEmployeeId:
      state.adminCommon.employeeSelection.ui.selection.selectedEmployeeId,
    isSearchExecuted: searchCondition.isSearchExecuted,
    targetDateQuery: searchCondition.targetDateQuery,
    employeeNameQuery: searchCondition.employeeNameQuery,
    employeeCodeQuery: searchCondition.employeeCodeQuery,
    departmentNameQuery: searchCondition.departmentNameQuery,
    workingTypeNameQuery: searchCondition.workingTypeNameQuery,
    companyId: state.base.menuPane.ui.targetCompanyId,
    searchCondition,
  };
};

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators(
    {
      onChangeTargetDateQuery: searchConditionUIActions.updateTargetDateQuery,
      onChangeEmployeeCodeQuery:
        searchConditionUIActions.updateEmployeeCodeQuery,
      onChangeEmployeeNameQuery:
        searchConditionUIActions.updateEmployeeNameQuery,
      onChangeDepartmentNameQuery:
        searchConditionUIActions.updateDepartmentNameQuery,
      onChangeWorkingTypeNameQuery:
        searchConditionUIActions.updateWorkingTypeNameQuery,
      onSubmitSearchSuccess: searchConditionUIActions.setSearchExecuted,
      onClickEmployee: selectionUIActions.setSelectedEmployeeId,
    },
    dispatch
  ),
  onClickEmployee: (employeeId) => {
    dispatch(selectionUIActions.setSelectedEmployeeId(employeeId));
    dispatch(editingEntryPeriodStatusUIActions.initialize(employeeId));
  },
  onSubmitSearchForm: (stateProps, dispatchProps) => {
    const { searchCondition, companyId } = stateProps;
    dispatch(
      employeeListEntityActions.fetch(
        buildFetchQuery(searchCondition, companyId, stateProps.limit),
        dispatchProps.onSubmitSearchSuccess
      )
    );
  },
});

const mergeProps = (stateProps, dispatchProps) => ({
  ...stateProps,
  ...dispatchProps,
  onSubmitSearchForm: () =>
    dispatchProps.onSubmitSearchForm(stateProps, dispatchProps),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(ListPane);
