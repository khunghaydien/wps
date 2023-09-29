import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import _ from 'lodash';
import moment from 'moment';

import { DateRangeOption } from '../../../commons/components/fields/DropdownDateRange';
import { actions as departmentListActions } from '@commons/modules/exp/entities/departmentList';
import { actions as employeeListActions } from '@commons/modules/exp/entities/employeeList';
import { actions as departmentActions } from '@commons/modules/exp/ui/reportList/advSearch/departmentBaseIds';
import { actions as employeeActions } from '@commons/modules/exp/ui/reportList/advSearch/empBaseIds';
import { actions as requestDateActions } from '@commons/modules/exp/ui/reportList/advSearch/requestDateRange';
import { actions as statusActions } from '@commons/modules/exp/ui/reportList/advSearch/statusList';

import { DEPARTMENT_LIST } from '../../../domain/models/exp/Department';
import {
  initialSearchCondition,
  OPTION_LIMIT,
  submitDateInitVal,
} from '../../../domain/models/exp/request/Report';
import { REQUEST_MODULE } from '../../models/RequestCount';

// import { actions as detailActions } from '../../modules/entities/expenses/detail';
//
import { actions as taxTypeActions } from '../../../domain/modules/exp/taxType';
import { actions as companyRequestActions } from '../../modules/entities/expenses/companyRequestCount';
import { actions as proxyEmpActions } from '../../modules/entities/expenses/proxyEmpAccess';
import { actions as companyRequestCountActions } from '../../modules/ui/companyRequestCount';
import { tabType as TABS } from '../../modules/ui/tabs';

import {
  browseDetailForExpApproval,
  fetchAllIdsForExpApproval,
  fetchExpListForExpApproval,
} from '../../action-dispatchers/Expenses';

import List from '../../components/ExpensesRequestListPane/List';

const selectedOptions = (selectedIds, data = []) => {
  return data.filter(({ value }) => selectedIds.includes(value));
};

const mapStateToProps = (state) => {
  const companyCountOption = state.ui.companyRequestCount.countOptions;

  const selectedCompanyId =
    state.ui.companyRequestCount.selectedComId || state.userSetting.companyId;
  const selectedComIndex = companyCountOption.findIndex(
    ({ value }) => value === selectedCompanyId
  );
  const { currencySymbol, currencyDecimal: currencyDecimalPlaces } =
    selectedComIndex > -1
      ? companyCountOption[selectedComIndex]
      : state.userSetting;

  return {
    currencySymbol,
    currencyDecimalPlaces,
    selectedCompanyId,
    companyCount: state.ui.companyCount,
    selectedIds: state.ui.expenses.list.selectedIds,
    currentPage: state.ui.expenses.list.page,
    expIdsInfo: state.entities.exp.request.report.expIdsInfo || {},
    browseId: state.entities.exp.request.report.expRequest.requestId || '',
    requestList: state.entities.exp.request.report.expRequestList,
    userSetting: state.userSetting,
    advSearchCondition: state.exp.ui.reportList.advSearch,
    employeeOptions: state.exp.entities.employeeList,
    departmentOptions: state.exp.entities.departmentList,
    proxyEmployeeInfo: state.common.proxyEmployeeInfo,
    companyCountOption: state.ui.companyRequestCount.countOptions,
    isRequestCountLoading: state.ui.companyRequestCount.isloading,
    companyCountObject: state.entities.expenses.companyRequestCount,
    totalCount: state.ui.requestCounts.expenses,
    proxyEmpAccess: state.entities.expenses.proxyEmpAccess,
  };
};

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      fetchAllIdsForExpApproval,
      fetchExpListForExpApproval,
      browseDetailForExpApproval,
      taxList: taxTypeActions.search,
      fetchEmployeeList: employeeListActions.list,
      fetchDepartmentList: departmentListActions.list,
      setSubmitDate: requestDateActions.set,
      clearStatus: statusActions.reset,
      clearEmployee: employeeActions.clear,
      clearDepartment: departmentActions.clear,
      clearSubmitDate: requestDateActions.clear,
      fetchRequestCountByCompany: companyRequestActions.fetch,
      setCompanyId: companyRequestCountActions.setCompanyId,
      getProxyEmpAccess: proxyEmpActions.getProxyEmpAccess,
    },
    dispatch
  );

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...stateProps,
  ...dispatchProps,
  ...ownProps,
  onClickPagerLink: (pageNum: number) => {
    const {
      proxyEmployeeInfo: { id, isProxyMode },
      userSetting,
    } = stateProps;
    const empBaseId = isProxyMode ? id : userSetting.employeeId;
    dispatchProps.fetchExpListForExpApproval(
      stateProps.expIdsInfo.requestIdList,
      pageNum,
      empBaseId
    );
  },
  fetchAllIdsForExpApproval: (searchCondition, empId, isEmpty) => {
    const { selectedCompanyId } = stateProps;
    if (selectedCompanyId) {
      searchCondition.companyIdSet = [selectedCompanyId];
    }
    dispatchProps.fetchAllIdsForExpApproval(searchCondition, empId, isEmpty);
  },
  onClickRefreshButton: () => {
    const {
      proxyEmployeeInfo: { id, isProxyMode, expReportRequestCount },
      userSetting,
      selectedCompanyId,
      advSearchCondition,
    } = stateProps;
    const empId = isProxyMode ? id : userSetting.employeeId;
    const isEmpty = isProxyMode && expReportRequestCount === 0;
    if (selectedCompanyId) {
      advSearchCondition.companyIdSet = [selectedCompanyId];
    }
    // To search using same condition for last search
    dispatchProps.fetchAllIdsForExpApproval(advSearchCondition, empId, isEmpty);
    dispatchProps.taxList(moment().format('YYYY-MM-DD'));
  },
  onClickAdvSearchButton: () => {
    const {
      proxyEmployeeInfo: { id, isProxyMode, expReportRequestCount },
      userSetting,
      selectedCompanyId,
      advSearchCondition,
    } = stateProps;
    const empId = isProxyMode ? id : userSetting.employeeId;
    const isEmpty = isProxyMode && expReportRequestCount === 0;
    if (selectedCompanyId) {
      advSearchCondition.companyIdSet = [selectedCompanyId];
    }
    dispatchProps.fetchAllIdsForExpApproval(advSearchCondition, empId, isEmpty);
  },
  browseDetail: (reportId: string) => {
    const {
      proxyEmployeeInfo: { id, isProxyMode },
      userSetting,
    } = stateProps;
    const empId = isProxyMode ? id : userSetting.employeeId;
    dispatchProps.browseDetailForExpApproval(reportId, empId);
    dispatchProps.taxList(moment().format('YYYY-MM-DD'));
  },
  onClickInputValueSubmitDate: (
    date: DateRangeOption,
    needUpdateList: boolean
  ) => {
    const {
      advSearchCondition: { departmentBaseIds, empBaseIds, requestDateRange },
      departmentOptions,
      employeeOptions,
    } = stateProps;

    dispatchProps.setSubmitDate(date);

    if (date.startDate === requestDateRange.startDate) {
      return;
    }

    if (needUpdateList) {
      dispatchProps.fetchEmployeeList(
        stateProps.selectedCompanyId,
        date.startDate,
        OPTION_LIMIT + 1,
        undefined,
        selectedOptions(empBaseIds, employeeOptions)
      );
      dispatchProps.fetchDepartmentList(
        stateProps.selectedCompanyId,
        date.startDate,
        OPTION_LIMIT + 1,
        [DEPARTMENT_LIST],
        selectedOptions(departmentBaseIds, departmentOptions)
      );
    }
  },
  clearSearchCondition: () => {
    dispatchProps.clearStatus();
    dispatchProps.clearEmployee();
    dispatchProps.clearSubmitDate();
    dispatchProps.clearDepartment();
  },
  fetchInitialEmployeeList: () => {
    const dateRange = submitDateInitVal();
    dispatchProps.fetchEmployeeList(
      stateProps.selectedCompanyId,
      dateRange.startDate,
      OPTION_LIMIT + 1
    );
    dispatchProps.fetchDepartmentList(
      stateProps.selectedCompanyId,
      dateRange.startDate,
      OPTION_LIMIT + 1,
      [DEPARTMENT_LIST]
    );
  },
  fetchRequestCountByCompany: () => {
    const {
      proxyEmployeeInfo: { isProxyMode, id },
      proxyEmpAccess: { companyId },
      userSetting,
    } = stateProps;
    const empId = isProxyMode ? id : userSetting.employeeId;
    const comId = isProxyMode ? companyId : userSetting.companyId;
    dispatchProps.fetchRequestCountByCompany(
      empId,
      isProxyMode,
      comId,
      REQUEST_MODULE.EXPENSES,
      TABS.EXPENSES
    );
  },
  onChangeCompany: (companyId: string) => {
    const {
      proxyEmployeeInfo: { id, isProxyMode },
      userSetting,
      companyCountObject,
    } = stateProps;
    const isEmpty = companyCountObject[companyId].count === 0;
    const empId = isProxyMode ? id : userSetting.employeeId;
    dispatchProps.fetchAllIdsForExpApproval(
      { ...initialSearchCondition, companyIdSet: [companyId] },
      empId,
      isEmpty
    );
    dispatchProps.setCompanyId(companyId);
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(List) as React.ComponentType<Record<string, any>>;
