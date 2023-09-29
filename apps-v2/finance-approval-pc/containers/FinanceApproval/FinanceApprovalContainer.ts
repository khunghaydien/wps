import { connect } from 'react-redux';
import { compose } from 'redux';

import { find, isEmpty } from 'lodash';

import lifecycle from '../../../mobile-app/concerns/lifecycle';

import { confirm, withLoading } from '../../../commons/actions/app';
import { DateRangeOption } from '../../../commons/components/fields/DropdownDateRange';
import msg from '../../../commons/languages';
import { actions as detailActions } from '@apps/commons/modules/exp/ui/reportList/advSearch/detail';
import { actions as costCenterListActions } from '@commons/modules/exp/entities/costCenterList';
import { actions as departmentListActions } from '@commons/modules/exp/entities/departmentList';
import { actions as employeeListActions } from '@commons/modules/exp/entities/employeeList';
import { actions as reportTypeListActions } from '@commons/modules/exp/entities/reportTypeList';
import { actions as vendorListActions } from '@commons/modules/exp/entities/vendorList';
import { actions as accountingDateActions } from '@commons/modules/exp/ui/reportList/advSearch/accountingDateRange';
import { actions as amountActions } from '@commons/modules/exp/ui/reportList/advSearch/amountRange';
import { actions as costCenterActions } from '@commons/modules/exp/ui/reportList/advSearch/costCenterBaseIds';
import { actions as departmentActions } from '@commons/modules/exp/ui/reportList/advSearch/departmentBaseIds';
import { actions as employeeActions } from '@commons/modules/exp/ui/reportList/advSearch/empBaseIds';
import { actions as statusActions } from '@commons/modules/exp/ui/reportList/advSearch/financeStatusList';
import { actions as reportNoActions } from '@commons/modules/exp/ui/reportList/advSearch/reportNo';
import { actions as reportTypeActions } from '@commons/modules/exp/ui/reportList/advSearch/reportTypeIds';
import { actions as requestDateActions } from '@commons/modules/exp/ui/reportList/advSearch/requestDateRange';
import { actions as titleActions } from '@commons/modules/exp/ui/reportList/advSearch/subject';
import { actions as vendorIdsActions } from '@commons/modules/exp/ui/reportList/advSearch/vendorIds';

import {
  getSearchConditionListType,
  MAX_COST_CENTER_LIMIT,
} from '../../../domain/models/exp/FinanceApproval';
import { DEPARTMENT_LIST } from '@apps/domain/models/exp/Department';
import { OPTION_LIMIT } from '@apps/domain/models/exp/request/Report';

// import { actions as dialogNameActions } from '../../modules/ui/FinanceApproval/dialog/searchCondition/name';
import { actions as dialogNameActions } from '../../../expenses-pc/modules/ui/expenses/dialog/approval/comment';
import {
  actions as modeActions,
  modes,
} from '../../../expenses-pc/modules/ui/expenses/mode';
import { actions as overlapActions } from '../../../expenses-pc/modules/ui/expenses/overlap';
import { AppDispatch } from '../../modules/AppThunk';
import { actions as advSearchCondition } from '../../modules/entities/advSearchConditionList';
import { actions as bulkErrorActions } from '../../modules/ui/FinanceApproval/bulkApproval/error';
import { actions as activeDialogActions } from '../../modules/ui/FinanceApproval/dialog/activeDialog';
import { actions as selectedIdsActions } from '../../modules/ui/FinanceApproval/RequestList/selectedIds';
import { actions as selectedSearchConditionActions } from '../../modules/ui/FinanceApproval/RequestList/selectedSearchCondition';
import { isRequestTab } from '@apps/finance-approval-pc/modules/ui/FinanceApproval/tabs';
import { actions as requestModeActions } from '@apps/requests-pc/modules/ui/expenses/mode';

import {
  backFromDetailToList,
  deteleAdvSearchCondition,
  fetchExpRequest,
  fetchFinanceApprovalIdList,
  fetchFinanceApprovalList,
  fetchFinanceApprovalPreRequestIdList,
  fetchInitialSetting,
  fetchPreRequestReport,
  listVendor,
  resetFilters,
  saveSearchCondition,
} from '../../action-dispatchers/FinanceApproval';

import FinanceApproval from '../../components/FinanceApproval';

// put function call outside so that it will only initialize once and not everytime when state is updated
const labelObject = () => ({
  reports: msg().Exp_Lbl_Reports,
  newReport: msg().Exp_Lbl_NewReportCreateExp,
  accountingDate: msg().Exp_Clbl_RecordDate,
  isFinanceApproval: true,
});

const selectedOptions = (selectedIds, data = []) => {
  return data.filter(({ value }) => selectedIds.includes(value)) || [];
};

const mapStateToProps = (state) => {
  const selectedTab = state.ui.FinanceApproval.tabs.selected;
  const isRequestTabSelected = isRequestTab(selectedTab);
  const idListPath = isRequestTabSelected
    ? 'preRequestIdList'
    : 'requestIdList';
  const requestIdList = state.entities[idListPath].requestIdList;
  const selectedRequestId = state.ui.expenses.selectedExpReport.requestId;
  const selectedCompanyId =
    state.ui.FinanceApproval.companySwitch || state.userSetting.companyId;
  // The idx of the screen being displayed.
  // if no report is selected, values is -1
  const currentRequestIdx = selectedRequestId
    ? requestIdList.indexOf(selectedRequestId)
    : -1;
  const currencyDecimalPlaces =
    selectedCompanyId === state.userSetting.companyId
      ? state.userSetting.currencyDecimalPlaces
      : state.entities.companyList.find(
          ({ value }) => value === selectedCompanyId
        )?.currencyDecimalPlaces;
  const searchConditionListType =
    getSearchConditionListType(isRequestTabSelected);
  const allAdvSearchConditionList =
    state.entities.advSearchConditionList[searchConditionListType];
  const fetchedAdvSearchConditionList = allAdvSearchConditionList.filter(
    ({ companyId }, idx) => selectedCompanyId === companyId || idx === 0
  );

  return {
    labelObject,
    requestIdList,
    currentRequestIdx,
    selectedCompanyId,
    currencyDecimalPlaces,
    mode: state.ui.expenses.mode,
    overlap: state.ui.expenses.overlap,
    currentPage: state.ui.FinanceApproval.RequestList.page,
    requestTotalNum: state.entities[idListPath].totalSize,
    orderBy: state.ui.FinanceApproval.RequestList.orderBy,
    sortBy: state.ui.FinanceApproval.RequestList.sortBy,
    advSearchDepartment: state.ui.FinanceApproval.RequestList.department,
    advSearchEmployee: state.ui.FinanceApproval.RequestList.employee,
    departmentOptions: state.common.exp.entities.departmentList,
    employeeOptions: state.common.exp.entities.employeeList,
    costCenterOptions: state.common.exp.entities.costCenterList,
    vendorOptions: state.common.exp.entities.vendorList,
    reportTypeOptions: state.common.exp.entities.reportTypeList,
    reportTypeListActive: state.entities.exp.expenseReportType.list.active,
    reportTypeListInactive: state.entities.exp.expenseReportType.list.inactive,
    advSearchCondition: state.common.exp.ui.reportList.advSearch,
    allAdvSearchConditionList,
    fetchedAdvSearchConditionList,
    selectedSearchConditionName:
      state.ui.FinanceApproval.RequestList.selectedSearchCondition,
    selectedDetail: state.common.exp.ui.reportList.advSearch.detail,
    selectedAccountingDate:
      state.common.exp.ui.reportList.advSearch.accountingDateRange,
    selectedReportNo: state.common.exp.ui.reportList.advSearch.reportNo,
    selectedReportTypeIds:
      state.common.exp.ui.reportList.advSearch.reportTypeIds,
    selectedCostCenterBaseIds:
      state.common.exp.ui.reportList.advSearch.costCenterBaseIds,
    selectedAmountRange: state.common.exp.ui.reportList.advSearch.amountRange,
    dropdownValues: state.ui.FinanceApproval.DropdownValues,
    userSetting: state.userSetting,
    approvalHistory: state.entities.exp.approval.request.history,
    isRequestTab: isRequestTabSelected,
  };
};

const mapDispatchToProps = {
  advSearchCondition,
  backFromDetailToList,
  backToHome: overlapActions.nonOverlapReport,
  confirm,
  deteleAdvSearchCondition,
  dialog: activeDialogActions.searchCondition,
  fetchDepartmentList: departmentListActions.list,
  fetchEmployeeList: employeeListActions.list,
  fetchReportTypeList: reportTypeListActions.list,
  fetchCostCenterList: costCenterListActions.list,
  fetchVendorList: vendorListActions.list,
  fetchExpRequest,
  fetchPreRequestReport,
  listVendor,
  fetchFinanceApprovalIdList,
  fetchFinanceApprovalList,
  fetchFinanceApprovalPreRequestIdList,
  fetchInitialSetting,
  onClickDeleteConditionButton: activeDialogActions.deleteSearchCondition,
  saveSearchCondition,
  setAccountingDateInitialValue: accountingDateActions.replace,
  setAmountInitialValue: amountActions.replace,
  setComment: dialogNameActions.set,
  setReportTypeValue: reportTypeActions.replace,
  setCostCenterValue: costCenterActions.replace,
  setVendorInitialValue: vendorIdsActions.replace,
  setTitleInitialValue: titleActions.replace,
  setDepartmentInitialValue: departmentActions.replace,
  setDetailInitialValue: detailActions.replace,
  setEmployeeInitialValue: employeeActions.replace,
  setReportNoInitialValue: reportNoActions.replace,
  setRequestDate: requestDateActions.set,
  setRequestDateInitialValue: requestDateActions.replace,
  setSearchCondition: selectedSearchConditionActions.set,
  withLoading,
  resetFilters,
  setStatusInitialValue: statusActions.replace,
  changeModetoSelect: modeActions.reportSelect,
  requestChangeModetoSelect: requestModeActions.reportSelect,
  clearBulkError: bulkErrorActions.clear,
  clearSelectedIds: selectedIdsActions.clear,
};

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...stateProps,
  ...dispatchProps,
  ...ownProps,

  onClickRefreshButton: () => {
    // To search using same condition for last search
    const dispatchFetchIdList = stateProps.isRequestTab
      ? dispatchProps.fetchFinanceApprovalPreRequestIdList
      : dispatchProps.fetchFinanceApprovalIdList;
    dispatchProps.clearSelectedIds();
    dispatchProps.clearBulkError();
    dispatchFetchIdList(
      stateProps.selectedCompanyId,
      '',
      '',
      stateProps.advSearchCondition
    );
  },

  onClickAdvSearchButton: () => {
    const dispatchFetchIdList = stateProps.isRequestTab
      ? dispatchProps.fetchFinanceApprovalPreRequestIdList
      : dispatchProps.fetchFinanceApprovalIdList;
    dispatchProps.clearSelectedIds();
    dispatchProps.clearBulkError();
    dispatchFetchIdList(
      stateProps.selectedCompanyId,
      null,
      null,
      stateProps.advSearchCondition
    );
  },
  // Move to next to report. it's either +1 or -1
  onClickNextToRequestButton: (moveNum: number) => {
    const {
      requestIdList,
      currentRequestIdx,
      reportTypeListActive,
      reportTypeListInactive,
      isRequestTab,
      selectedCompanyId,
    } = stateProps;
    const _ = undefined;
    const nextRequestId = requestIdList[currentRequestIdx + moveNum];
    const reportTypeList = [...reportTypeListActive, ...reportTypeListInactive];

    const fetchNextReport = () =>
      isRequestTab
        ? dispatchProps.fetchPreRequestReport(
            nextRequestId,
            selectedCompanyId,
            _,
            reportTypeList
          )
        : dispatchProps.fetchExpRequest(nextRequestId, _, true, reportTypeList);

    if (stateProps.mode === modes.FINANCE_REPORT_EDITED) {
      dispatchProps.confirm(msg().Common_Confirm_DiscardEdits, (yes) => {
        if (yes) {
          fetchNextReport();
        }
      });
    } else {
      fetchNextReport();
    }
  },
  // Take a list according to the idx of display screen
  // when come back from detail screen again.
  onClickBackButton: () => {
    if (stateProps.mode === modes.FINANCE_REPORT_EDITED) {
      dispatchProps.confirm(msg().Common_Confirm_DiscardEdits, (yes) => {
        if (yes) {
          dispatchProps.backFromDetailToList(
            stateProps.requestIdList,
            stateProps.currentRequestIdx,
            stateProps.isRequestTab
          );
        }
      });
    } else {
      dispatchProps.backFromDetailToList(
        stateProps.requestIdList,
        stateProps.currentRequestIdx,
        stateProps.isRequestTab
      );
    }

    if (stateProps.mode !== modes.REPORT_SELECT) {
      const dispatchChangeModeToSelect = stateProps.isFAExpenseTab
        ? dispatchProps.changeModetoSelect
        : dispatchProps.requestChangeModetoSelect;
      dispatchChangeModeToSelect();
    }
  },
  onClickSaveConditionButton: () => {
    dispatchProps.dialog();
    dispatchProps.setComment(stateProps.selectedSearchConditionName);
  },
  onClickCondititon: (e: React.ChangeEvent<HTMLSelectElement>) => {
    const searchConditionName = e.target.value;
    const selectedSearchCondition = find(
      stateProps.fetchedAdvSearchConditionList,
      { name: searchConditionName }
    );
    dispatchProps.setSearchCondition(searchConditionName);
    const dispatchFetchIdList = stateProps.isRequestTab
      ? dispatchProps.fetchFinanceApprovalPreRequestIdList
      : dispatchProps.fetchFinanceApprovalIdList;
    dispatchProps.clearSelectedIds();
    dispatchProps.clearBulkError();
    if (
      searchConditionName === stateProps.selectedSearchConditionName ||
      !searchConditionName
    ) {
      dispatchProps.resetFilters();
      dispatchFetchIdList(stateProps.selectedCompanyId, null, null, null);
    } else {
      dispatchFetchIdList(
        stateProps.selectedCompanyId,
        null,
        null,
        selectedSearchCondition
      );
      const targetDate = selectedSearchCondition.requestDateRange.startDate;
      const currentVendorIds = stateProps.vendorOptions.map(
        (vendor) => vendor.value
      );
      const vendorNotInList = selectedSearchCondition.vendorIds.filter(
        (vendorId) => !currentVendorIds.includes(vendorId)
      );
      dispatchProps
        .withLoading(() =>
          Promise.all([
            dispatchProps.fetchDepartmentList(
              stateProps.selectedCompanyId,
              targetDate,
              OPTION_LIMIT + 1,
              [DEPARTMENT_LIST],
              undefined,
              selectedSearchCondition.departmentBaseIds
            ),
            dispatchProps.fetchEmployeeList(
              stateProps.selectedCompanyId,
              targetDate,
              OPTION_LIMIT + 1,
              undefined,
              undefined,
              selectedSearchCondition.empBaseIds
            ),
            dispatchProps.fetchReportTypeList(
              stateProps.selectedCompanyId,
              targetDate
            ),
            dispatchProps.fetchCostCenterList(
              stateProps.selectedCompanyId,
              targetDate,
              undefined,
              MAX_COST_CENTER_LIMIT
            ),
            ...(!isEmpty(vendorNotInList)
              ? [
                  dispatchProps.fetchVendorList(
                    stateProps.selectedCompanyId,
                    stateProps.vendorOptions,
                    vendorNotInList
                  ),
                ]
              : []),
          ])
        )
        .then(() => {
          dispatchProps.setDepartmentInitialValue(
            selectedSearchCondition.departmentBaseIds
          );

          dispatchProps.setEmployeeInitialValue(
            selectedSearchCondition.empBaseIds
          );

          dispatchProps.setReportTypeValue(
            selectedSearchCondition.reportTypeIds
          );
          dispatchProps.setCostCenterValue(
            selectedSearchCondition.costCenterBaseIds
          );

          dispatchProps.setStatusInitialValue(
            selectedSearchCondition.financeStatusList
          );
          dispatchProps.setAccountingDateInitialValue(
            selectedSearchCondition.accountingDateRange
          );
          dispatchProps.setRequestDateInitialValue(
            selectedSearchCondition.requestDateRange
          );
          dispatchProps.setReportNoInitialValue(
            selectedSearchCondition.reportNo
          );
          dispatchProps.setAmountInitialValue(
            selectedSearchCondition.amountRange
          );
          dispatchProps.setVendorInitialValue(
            selectedSearchCondition.vendorIds
          );
          dispatchProps.setTitleInitialValue(selectedSearchCondition.subject);
          dispatchProps.setDetailInitialValue(selectedSearchCondition.detail);
        });
    }
  },

  onClickInputValueRequestDate: (
    date: DateRangeOption,
    needUpdateList: boolean
  ) => {
    const {
      advSearchCondition: { departmentBaseIds, empBaseIds, requestDateRange },
      departmentOptions,
      employeeOptions,
    } = stateProps;

    dispatchProps.setRequestDate(date);

    if (date.startDate === requestDateRange.startDate) {
      return;
    }

    if (needUpdateList) {
      dispatchProps.fetchDepartmentList(
        stateProps.selectedCompanyId,
        date.startDate,
        OPTION_LIMIT + 1,
        [DEPARTMENT_LIST],
        selectedOptions(departmentBaseIds, departmentOptions)
      );
      dispatchProps.fetchEmployeeList(
        stateProps.selectedCompanyId,
        date.startDate,
        OPTION_LIMIT + 1,
        undefined,
        selectedOptions(empBaseIds, employeeOptions)
      );
      dispatchProps.fetchReportTypeList(
        stateProps.selectedCompanyId,
        date.startDate
      );
      dispatchProps.fetchCostCenterList(
        stateProps.selectedCompanyId,
        date.startDate,
        undefined,
        MAX_COST_CENTER_LIMIT
      );
    }
  },
});

export default compose<any>(
  connect(mapStateToProps, mapDispatchToProps, mergeProps),
  lifecycle({
    componentDidMount(_dispatch: AppDispatch, props) {
      props.fetchInitialSetting(props.userSetting.companyId);
    },
  })
)(FinanceApproval) as React.ComponentType<Record<string, any>>;
