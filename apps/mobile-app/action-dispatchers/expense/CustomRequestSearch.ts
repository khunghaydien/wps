import { find, get } from 'lodash';

import { withLoading } from '../../modules/commons/loading';
import { DateRangeOption } from '@apps/commons/components/fields/DropdownDateRange';

import { AccountingPeriodList } from '@apps/domain/models/exp/AccountingPeriod';
import {
  CustomRequestList,
  RequestTypeList,
  SearchCondition,
} from '@apps/domain/models/exp/CustomRequest';
import { requestDateInitVal } from '@apps/domain/models/exp/Report';

import { State } from '../../modules';
import { AppDispatch } from '../../modules/expense/AppThunk';
import { actions as customRequestTypeActions } from '../../modules/expense/entities/advSearch/customRequestTypeList';
import {
  actions as empListActions,
  DEFAULT_LIMIT_NUMBER,
  EmployeeOptionList,
} from '../../modules/expense/entities/advSearch/employeeList';
import { actions as customRequestListActions } from '../../modules/expense/entities/customRequestList';
import { actions as requestTypeActions } from '../../modules/expense/ui/advSearch/customRequestTypeList';
import { actions as empBaseIdActions } from '../../modules/expense/ui/advSearch/empBaseIdList';
import { actions as requestDateRangeActions } from '../../modules/expense/ui/advSearch/requestDateRange';
import { actions as statusActions } from '../../modules/expense/ui/advSearch/statusList';
import { actions as titleActions } from '../../modules/expense/ui/advSearch/title';

export const setInitialEmpBaseIdList =
  () =>
  (dispatch: AppDispatch, getState: State): void => {
    dispatch(empBaseIdActions.set([getState().userSetting.employeeId]));
  };

export const getInitialRequestDateRange = (
  accountingPeriodId: string,
  accountingPeriodAll: AccountingPeriodList
): DateRangeOption => {
  const selectedAccountingPeriod = find(accountingPeriodAll, {
    id: accountingPeriodId,
  });
  let startDate = get(selectedAccountingPeriod, 'validDateFrom');
  let endDate = get(selectedAccountingPeriod, 'validDateTo');
  // if no accounting period, use initial date range
  if (!startDate || !endDate) {
    startDate = requestDateInitVal().startDate;
    endDate = requestDateInitVal().endDate;
  }
  return { startDate, endDate };
};

export const setInitialRequestDateRange =
  () =>
  (dispatch: AppDispatch, getState: State): void => {
    const { accountingPeriodId } = getState().expense.ui.report.formValues;
    const accountingPeriodAll = getState().expense.entities.accountingPeriod;
    const requestDateRange = getInitialRequestDateRange(
      accountingPeriodId,
      accountingPeriodAll
    );
    dispatch(requestDateRangeActions.set(requestDateRange));
  };

export const resetSearchCondition =
  () =>
  (dispatch: AppDispatch): void => {
    dispatch(statusActions.clear());
    dispatch(requestTypeActions.clear());
    dispatch(titleActions.clear());
    dispatch(setInitialEmpBaseIdList());
    dispatch(setInitialRequestDateRange());
  };

export const searchEmpList =
  (companyId: string, targetDate: string, optionLimit: number, query: string) =>
  (dispatch: AppDispatch): Promise<EmployeeOptionList> => {
    return dispatch(
      withLoading(
        empListActions.search(companyId, targetDate, optionLimit, query)
      )
    );
  };

export const getEmployeeList =
  (
    targetDate?: string,
    limitNum?: number,
    prevSelectedOptions?: EmployeeOptionList
  ) =>
  (dispatch: AppDispatch, getState: State): Promise<EmployeeOptionList> => {
    const companyId = getState().userSetting.companyId;

    let targetedDate = targetDate;
    if (!targetedDate) {
      const { accountingPeriodId } = getState().expense.ui.report.formValues;
      const accountingPeriodAll = getState().expense.entities.accountingPeriod;
      const selectedAccountingPeriod = find(accountingPeriodAll, {
        id: accountingPeriodId,
      });
      targetedDate =
        get(selectedAccountingPeriod, 'validDateFrom') ||
        requestDateInitVal().startDate;
    }
    const limitNumber = limitNum || DEFAULT_LIMIT_NUMBER;

    return dispatch(
      empListActions.fetchList(
        companyId,
        targetedDate,
        limitNumber,
        prevSelectedOptions
      )
    );
  };

export const getCustomRequestTypes =
  () =>
  (dispatch: AppDispatch): Promise<RequestTypeList> =>
    dispatch(withLoading(customRequestTypeActions.get()));

export const searchCustomRequest =
  (searchCondition: SearchCondition) =>
  (dispatch: AppDispatch): Promise<CustomRequestList> =>
    dispatch(withLoading(customRequestListActions.search(searchCondition)));
