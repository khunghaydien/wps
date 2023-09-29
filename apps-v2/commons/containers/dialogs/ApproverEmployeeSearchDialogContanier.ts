import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { selectors as ApproverEmployeeSearchEntitiesSelectors } from '../../modules/approverEmployeeSearch/entities';
import { actions as ApproverEmployeeSearchUiOperationActions } from '../../modules/approverEmployeeSearch/ui/operation';

import * as ApproverEmployeeSearchActions from '../../action-dispatchers/ApproverEmployeeSearch';

import ApproverEmployeeSearchDialog from '../../components/dialogs/ApproverEmployeeSearchDialog';

const mapStateToProps = (state) => ({
  companyId: state.common.userSetting.companyId,
  departmentId: state.common.userSetting.departmentId,
  isVisible: state.common.approverEmployeeSearch.ui.dialog.isOpen,
  searchStrategy:
    state.common.approverEmployeeSearch.ui.operation.searchStrategy,
  isSearchByQueriesExecuted:
    state.common.approverEmployeeSearch.ui.operation.isSearchByQueriesExecuted,
  departmentCodeQuery:
    state.common.approverEmployeeSearch.ui.operation.departmentCode,
  departmentNameQuery:
    state.common.approverEmployeeSearch.ui.operation.departmentName,
  employeeCodeQuery:
    state.common.approverEmployeeSearch.ui.operation.employeeCode,
  employeeNameQuery:
    state.common.approverEmployeeSearch.ui.operation.employeeName,
  titleQuery: state.common.approverEmployeeSearch.ui.operation.title,
  targetDate: state.common.approverEmployeeSearch.ui.operation.targetDate,
  isOverLimit: state.common.approverEmployeeSearch.ui.operation.isOverLimit,
  employees:
    ApproverEmployeeSearchEntitiesSelectors.employeesButUsersSelector(state),
  selectedEmployeeId:
    ApproverEmployeeSearchEntitiesSelectors.selectedEmployeeIdSelector(state),
  selectedEmployee:
    ApproverEmployeeSearchEntitiesSelectors.selectedEmployeeSelector(state),
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      onSwitchSearchStrategy:
        ApproverEmployeeSearchActions.switchSearchStrategy,
      onEditDepartmentCodeQuery:
        ApproverEmployeeSearchUiOperationActions.editDepartmentCode,
      onEditDepartmentNameQuery:
        ApproverEmployeeSearchUiOperationActions.editDepartmentName,
      onEditEmployeeCodeQuery:
        ApproverEmployeeSearchUiOperationActions.editEmployeeCode,
      onEditEmployeeNameQuery:
        ApproverEmployeeSearchUiOperationActions.editEmployeeName,
      onEditTitleQuery: ApproverEmployeeSearchUiOperationActions.editTitle,
      onSearchByQueries:
        ApproverEmployeeSearchActions.searchByTargetDateAndCompanyIdAndInputValue,
      onSelectEmployee: ApproverEmployeeSearchUiOperationActions.selectEmployee,
      onDecide: ApproverEmployeeSearchActions.decide,
      onCancel: ApproverEmployeeSearchActions.cancel,
    },
    dispatch
  );

const mergeProps = (stateProps, dispatchProps) => ({
  ...stateProps,
  ...dispatchProps,
  onSwitchSearchStrategy: (newSearchStrategy) => {
    dispatchProps.onSwitchSearchStrategy(
      newSearchStrategy,
      stateProps.targetDate,
      stateProps.companyId,
      stateProps.departmentId
    );
  },
  onSearchByQueries: () => {
    dispatchProps.onSearchByQueries(
      stateProps.targetDate,
      stateProps.companyId,
      {
        departmentCode: stateProps.departmentCodeQuery,
        departmentName: stateProps.departmentNameQuery,
        employeeCode: stateProps.employeeCodeQuery,
        employeeName: stateProps.employeeNameQuery,
        title: stateProps.titleQuery,
      }
    );
  },
  onDecide: () => {
    dispatchProps.onDecide(stateProps.selectedEmployee);
  },
});

const ApproverEmployeeSearchContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(ApproverEmployeeSearchDialog);

(ApproverEmployeeSearchContainer as any).defaultProps = {
  onDecide: () => {},
  onCancel: () => {},
};

export default ApproverEmployeeSearchContainer;
