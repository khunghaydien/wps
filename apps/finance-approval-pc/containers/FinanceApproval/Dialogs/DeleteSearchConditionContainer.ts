import { connect } from 'react-redux';

import { cloneDeep, remove } from 'lodash';

import DeleteSearchCondition, {
  Props,
} from '../../../../commons/components/exp/Form/Dialog/DeleteSearchCondition';
import { actions as accountingDateActions } from '@commons/modules/exp/ui/reportList/advSearch/accountingDateRange';
import { actions as amountActions } from '@commons/modules/exp/ui/reportList/advSearch/amountRange';
import { actions as costCenterActions } from '@commons/modules/exp/ui/reportList/advSearch/costCenterBaseIds';
import { actions as departmentActions } from '@commons/modules/exp/ui/reportList/advSearch/departmentBaseIds';
import { actions as detailActions } from '@commons/modules/exp/ui/reportList/advSearch/detail';
import { actions as employeeActions } from '@commons/modules/exp/ui/reportList/advSearch/empBaseIds';
import { actions as statusActions } from '@commons/modules/exp/ui/reportList/advSearch/financeStatusList';
import { actions as reportNoActions } from '@commons/modules/exp/ui/reportList/advSearch/reportNo';
import { actions as reportTypeActions } from '@commons/modules/exp/ui/reportList/advSearch/reportTypeIds';
import { actions as requestDateActions } from '@commons/modules/exp/ui/reportList/advSearch/requestDateRange';

import { SearchConditions } from '../../../../domain/models/exp/FinanceApproval';

import { actions as commentActions } from '../../../../expenses-pc/modules/ui/expenses/dialog/approval/comment';
import { State } from '../../../modules';
import { actions as selectedSearchConditionActions } from '../../../modules/ui/FinanceApproval/RequestList/selectedSearchCondition';

import {
  deteleAdvSearchCondition,
  fetchFinanceApprovalIdList,
  fetchInitialSetting,
} from '../../../action-dispatchers/FinanceApproval';

import { Props as OwnProps } from '../../../components/FinanceApproval/Dialog';

const mapStateToProps = (state: State) => ({
  fetchedAdvSearchConditionList: state.entities.advSearchConditionList,
  selectedSearchConditionName:
    state.ui.FinanceApproval.RequestList.selectedSearchCondition,
  selectedCompanyId:
    state.ui.FinanceApproval.companySwitch || state.userSetting.companyId,
});

const mapDispatchToProps = {
  fetchInitialSetting,
  fetchFinanceApprovalIdList,
  deteleAdvSearchCondition,
  setSearchCondition: selectedSearchConditionActions.set,
  resetDepartmentInitialValue: departmentActions.clear,
  resetDetailInitialValue: detailActions.clear,
  resetEmployeeInitialValue: employeeActions.clear,
  resetStatusInitialValue: statusActions.reset,
  resetComment: commentActions.clear,
  clearRequestDate: requestDateActions.clear,
  clearAccountingDate: accountingDateActions.clear,
  clearAmount: amountActions.clear,
  clearReportNo: reportNoActions.clear,
  resetReportTypeInitialValue: reportTypeActions.clear,
  resetCostCenterInitialValue: costCenterActions.clear,
};

const mergeProps = (
  stateProps: ReturnType<typeof mapStateToProps>,
  dispatchProps: typeof mapDispatchToProps,
  ownProps: OwnProps
): Props => ({
  ...ownProps,
  ...stateProps,
  ...dispatchProps,
  onClickDeleteSearchCondition: () => {
    dispatchProps.resetComment();
    const cFetchedAdvSearchConditionList: SearchConditions[] = cloneDeep(
      stateProps.fetchedAdvSearchConditionList
    );
    cFetchedAdvSearchConditionList.shift();
    remove(cFetchedAdvSearchConditionList, (o) => {
      return o.name === stateProps.selectedSearchConditionName;
    });
    dispatchProps.deteleAdvSearchCondition(cFetchedAdvSearchConditionList);
    dispatchProps.setSearchCondition('');
    dispatchProps.resetDepartmentInitialValue();
    dispatchProps.resetEmployeeInitialValue();
    dispatchProps.resetStatusInitialValue();
    dispatchProps.clearRequestDate();
    dispatchProps.clearAccountingDate();
    dispatchProps.clearReportNo();
    dispatchProps.clearAmount();
    dispatchProps.resetDetailInitialValue();
    dispatchProps.resetReportTypeInitialValue();
    dispatchProps.resetCostCenterInitialValue();
    const _ = null;
    dispatchProps.fetchFinanceApprovalIdList(
      stateProps.selectedCompanyId,
      _,
      _,
      _
    );
    dispatchProps.fetchInitialSetting();
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(DeleteSearchCondition) as React.ComponentType<any> as React.ComponentType<
  Record<string, any>
>;
