import { connect } from 'react-redux';

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
import { actions as titleActions } from '@commons/modules/exp/ui/reportList/advSearch/subject';
import { actions as vendorActions } from '@commons/modules/exp/ui/reportList/advSearch/vendorIds';

import { actions as customHintActions } from '../../domain/modules/exp/customHint';
import { actions as expenseReportTypeActions } from '../../domain/modules/exp/expense-report-type/list';
import { actions as companyListActions } from '../modules/entities/companyList';
import { setCompanyId } from '../modules/ui/FinanceApproval/companySwitch';

import { initialize } from '../action-dispatchers/app';
import {
  fetchFinanceApprovalIdList,
  fetchInitialSetting,
} from '../action-dispatchers/FinanceApproval';

import App from '../components';

const mapStateToProps = (state) => ({
  userSetting: state.userSetting,
  companyCountOption: state.entities.companyList,
  companyCount: state.ui.FinanceApproval.companyCount,
  overlap: state.ui.expenses.overlap,
  selectedCompanyId:
    state.ui.FinanceApproval.companySwitch || state.userSetting.companyId,
});

const mapDispatchToProps = {
  initialize,
  fetchCompanyList: companyListActions.fetchCompanyList,
  setCompanyId,
  fetchInitialSetting,
  fetchFinanceApprovalIdList,
  fetchCustomHint: customHintActions.get,
  fetchReportTypeList: expenseReportTypeActions.list,

  // Reset filters on company change
  resetDepartmentInitialValue: departmentActions.clear,
  resetDetailInitialValue: detailActions.clear,
  resetEmployeeInitialValue: employeeActions.clear,
  resetStatusInitialValue: statusActions.reset,
  resetReportTypeInitialValue: reportTypeActions.clear,
  resetCostCenterInitialValue: costCenterActions.clear,
  clearAccountingDate: accountingDateActions.clear,
  clearAmount: amountActions.clear,
  clearReportNo: reportNoActions.clear,
  clearTitle: titleActions.clear,
  clearVendor: vendorActions.clear,
  clearRequestDate: requestDateActions.clear,
};

const mergeProps = (stateProps, dispatchProps) => ({
  ...stateProps,
  ...dispatchProps,
  onChangeCompany: (companyId: string) => {
    // Reset filters on company change
    dispatchProps.resetDepartmentInitialValue();
    dispatchProps.resetEmployeeInitialValue();
    dispatchProps.resetStatusInitialValue();
    dispatchProps.clearRequestDate();
    dispatchProps.clearAccountingDate();
    dispatchProps.clearReportNo();
    dispatchProps.clearAmount();
    dispatchProps.clearTitle();
    dispatchProps.clearVendor();
    dispatchProps.resetReportTypeInitialValue();
    dispatchProps.resetCostCenterInitialValue();
    dispatchProps.resetDetailInitialValue();

    dispatchProps.fetchInitialSetting(companyId);
    dispatchProps.fetchFinanceApprovalIdList(companyId).then(() => {
      dispatchProps.setCompanyId(companyId);
    });
    dispatchProps.fetchReportTypeList(companyId, 'REPORT');
    dispatchProps.fetchCustomHint(companyId, 'Expense');
  },
  fetchCompanyList: () => {
    const { employeeId, companyId } = stateProps.userSetting;
    dispatchProps.fetchCompanyList(employeeId, companyId);
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(App) as React.ComponentType<Record<string, any>>;
