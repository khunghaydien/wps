import { connect } from 'react-redux';
import { RouteComponentProps as OwnProps } from 'react-router-dom';
import { compose } from 'redux';

import cloneDeep from 'lodash/cloneDeep';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import { createSelector } from 'reselect';

import lifecycle from '@mobile/concerns/lifecycle';

import { filterField } from '@mobile/constants/advSearch';
import { EXPENSE_APPROVAL_REQUEST } from '@mobile/constants/approvalRequest';

import msg from '@commons/languages';
import AppPermissionUtil from '@commons/utils/AppPermissionUtil';
import DateUtil from '@commons/utils/DateUtil';

import { REQUEST_TYPE } from '@apps/domain/models/approval/request/Request';
import { DEPARTMENT_LIST } from '@apps/domain/models/exp/Department';
import {
  mobileInitialSearchCondition,
  OPTION_LIMIT,
} from '@apps/domain/models/exp/request/Report';

import { getStatusText } from '@apps/domain/modules/exp/report';
import { State } from '@mobile/modules';
import { actions as departmentActions } from '@mobile/modules/approval/ui/expense/advSearch/departmentBaseIds';
import { actions as employeeActions } from '@mobile/modules/approval/ui/expense/advSearch/empBaseIdList';
import {
  actions as requestDateActions,
  initialState as requestDateInitial,
  requestDateConverter,
  requestDateOptions,
} from '@mobile/modules/approval/ui/expense/advSearch/requestDateRange';
import { actions as statusActions } from '@mobile/modules/approval/ui/expense/advSearch/statusList';
import { actions as requestModuleActions } from '@mobile/modules/approval/ui/expense/requestModule';
import { set as setExpenseModule } from '@mobile/modules/approval/ui/isExpenseModule';
import { AppDispatch } from '@mobile/modules/expense/AppThunk';

import {
  fetchDeprtmentList,
  fetchEmpList,
  fetchExpRequestIds,
  fetchExpRequestList,
  resetExpRequestIds,
  resetExpRequestList,
} from '@mobile/action-dispatchers/approval/List';

import ListPage, {
  REPORT_PER_PAGE,
} from '@mobile/components/pages/approval/expense/ExpListPage';

export const statusSelector = (state: State) =>
  state.approval.ui.advSearch.statusList;
export const empSelector = (state: State) =>
  state.approval.ui.advSearch.empBaseIdList;
export const empEntitiesSelector = (state: State) =>
  state.approval.entities.expense.advSearch.employeeList;
export const departmentSelector = (state: State) =>
  state.approval.ui.advSearch.departmentBaseIds;
export const depEntitiesSelector = (state: State) =>
  state.approval.entities.expense.advSearch.departmentList;
export const requestDateSelector = (state: State) =>
  state.approval.ui.advSearch.requestDateRange;

const getStatus = createSelector(statusSelector, (statusList) => ({
  key: filterField.STATUS,
  label: msg().Exp_Btn_SearchConditionStatus,
  value: statusList.map((status) => getStatusText(status)).join(', '),
  count: statusList.length,
}));
const getEmployee = createSelector(
  empSelector,
  empEntitiesSelector,
  (idList, empList) => {
    const selected = empList
      .filter((emp) => idList.includes(emp.value))
      .map((emp) => emp.label);
    return {
      key: filterField.EMPLOYEE,
      label: msg().Exp_Btn_SearchConditionEmployee,
      value: selected.join(', '),
      count: selected.length,
    };
  }
);
const getDepartment = createSelector(
  departmentSelector,
  depEntitiesSelector,
  (idList, depList) => {
    const selected = depList
      .filter((item) => idList.includes(item.value))
      .map((item) => item.label);
    return {
      key: filterField.DEPARTMENT,
      label: msg().Exp_Btn_SearchConditionDepartment,
      value: selected.join(', '),
      count: selected.length,
    };
  }
);
const getRequestDate = createSelector(requestDateSelector, (requestDate) => {
  const selected = requestDateOptions().find(
    ({ value }) => value === requestDate
  );
  const tag = selected ? selected.label : requestDate;
  return {
    key: filterField.REQUEST_DATE,
    label: msg().Exp_Btn_SearchConditionRequestDate,
    value: tag,
    count: 1,
  };
});
export const getAdvSearchParam = (advCondition) => {
  const advSearchParam = cloneDeep(advCondition);
  const requestDate = requestDateConverter(advCondition.requestDateRange);
  advSearchParam.requestDateRange = requestDate;
  return advSearchParam;
};

const mapStateToProps = (state: State, ownProps: OwnProps) => {
  const {
    useExpense,
    employeeId,
    companyId,
    currencyId,
    currencyDecimalPlaces,
    currencySymbol,
  } = state.userSetting;
  const statusInfo = getStatus(state);
  const empInfo = getEmployee(state);
  const depInfo = getDepartment(state);
  const requestDateIno = getRequestDate(state);
  const tags = [statusInfo, requestDateIno, empInfo, depInfo];
  const hasPermissionError = AppPermissionUtil.checkPermissionError(
    useExpense,
    employeeId,
    currencyId,
    true
  );

  const activeModule = state.approval.ui.requestModule;
  const isExpense = activeModule === EXPENSE_APPROVAL_REQUEST.expense;
  let preRequestList = get(
    state,
    'approval.entities.expense.preRequestList',
    []
  );
  preRequestList = preRequestList.map((r) => ({
    ...r,
    requestType: REQUEST_TYPE.EXPENSE,
  }));
  return {
    ...ownProps,
    list: isExpense
      ? state.approval.entities.expense.requestList
      : preRequestList,
    idList: isExpense
      ? state.approval.entities.expense.requestIdList
      : state.approval.entities.expense.preRequestIdList,
    advSearchCondition: state.approval.ui.advSearch,
    employeeId,
    currencyDecimalPlaces,
    currencySymbol,
    tags,
    hasPermissionError,
    activeModule,
    isExpense,
    companyId,
  };
};

const mapDispatchToProps = {
  fetchExpRequestList,
  fetchExpRequestIds,
  resetExpRequestIds,
  resetExpRequestList,
  resetStatus: statusActions.clear,
  resetEmployee: employeeActions.clear,
  resetDepartment: departmentActions.clear,
  resetRequestDate: requestDateActions.clear,
  setRequestModule: requestModuleActions.set,
  setExpenseModule,
  fetchEmpList,
  fetchDeprtmentList,
};

const mergeProps = (
  stateProps: ReturnType<typeof mapStateToProps>,
  dispatchProps: typeof mapDispatchToProps,
  ownProps: OwnProps
) => ({
  ...stateProps,
  ...dispatchProps,
  ...ownProps,
  onClickReportSummary: (requestId: string) => {
    ownProps.history.push(
      `/approval/${stateProps.activeModule}/list/select/${requestId}`
    );
  },
  resetSearchConditon: () => {
    dispatchProps.resetStatus();
    dispatchProps.resetEmployee();
    dispatchProps.resetRequestDate();
    dispatchProps.resetDepartment();
    const { isExpense, employeeId, companyId } = stateProps;
    const targetDateRange = requestDateConverter(requestDateInitial);
    const targetDate = get(targetDateRange, 'startDate') || DateUtil.getToday();

    return Promise.all([
      dispatchProps.fetchExpRequestIds(
        mobileInitialSearchCondition,
        employeeId,
        isExpense,
        true
      ),
      dispatchProps.fetchEmpList(
        companyId,
        targetDate,
        OPTION_LIMIT + 1,
        undefined,
        true
      ),
      dispatchProps.fetchDeprtmentList(
        companyId,
        targetDate,
        OPTION_LIMIT + 1,
        [DEPARTMENT_LIST],
        undefined,
        true
      ),
    ]).then(([ids]) => {
      if (!isEmpty(ids)) {
        return dispatchProps.fetchExpRequestList(
          // @ts-ignore
          ids.slice(0, REPORT_PER_PAGE),
          employeeId,
          isExpense,
          true,
          true
        );
      }
      return dispatchProps.resetExpRequestList(isExpense);
    });
  },
  onClickFilterItem: (key) => {
    ownProps.history.push('/approval/expenses/advance-search/detail', {
      key,
    });
  },
  onRefresh: () => {
    const advSearchParams = getAdvSearchParam(stateProps.advSearchCondition);
    const { isExpense, employeeId } = stateProps;
    return (
      dispatchProps
        .fetchExpRequestIds(advSearchParams, employeeId, isExpense, true)
        // @ts-ignore
        .then((ids) => {
          if (!isEmpty(ids)) {
            return (
              dispatchProps
                .fetchExpRequestList(
                  ids.slice(0, REPORT_PER_PAGE),
                  employeeId,
                  isExpense,
                  true
                )
                // @ts-ignore
                .catch(() => {
                  // clear redux if fetch list API failure to prevent TSInfiniteScroll is in loading  mode
                  dispatchProps.resetExpRequestIds(isExpense);
                  dispatchProps.resetExpRequestList(isExpense);
                })
            );
          }
          return dispatchProps.resetExpRequestList(isExpense);
        })
    );
  },
  handleModuleChange: (module) => {
    dispatchProps.resetStatus();
    dispatchProps.resetEmployee();
    dispatchProps.resetRequestDate();
    dispatchProps.resetDepartment();
    dispatchProps.setRequestModule(module);
  },
});

export default compose<any>(
  connect(mapStateToProps, mapDispatchToProps, mergeProps),
  lifecycle({
    componentDidMount: (dispatch: AppDispatch, props) => {
      const { advSearchCondition, employeeId, isExpense } = props;
      const advSearchParams = getAdvSearchParam(advSearchCondition);
      dispatch(props.setExpenseModule(true));
      // @ts-ignore
      dispatch(fetchExpRequestIds(advSearchParams, employeeId, isExpense)).then(
        (ids: Array<string>) => {
          if (!isEmpty(ids)) {
            dispatch(
              fetchExpRequestList(
                ids.slice(0, REPORT_PER_PAGE),
                employeeId,
                isExpense,
                true
              )
            ).catch(() => {
              // clear id list to prevent TSInfiniteScroll infinite loading when fetch list API fails
              // TSInfiniteScroll compares if list length is shorter than id list, show loading spinner in bottom
              dispatch(resetExpRequestIds(isExpense));
            });
          }
        }
      );
    },
    componentWillUnmount: (dispatch: AppDispatch, { isExpense }) => {
      dispatch(resetExpRequestIds(isExpense));
      dispatch(resetExpRequestList(isExpense));
    },
  })
)(ListPage) as React.ComponentType<Record<string, any>>;
