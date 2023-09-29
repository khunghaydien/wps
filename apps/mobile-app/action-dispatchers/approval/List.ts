import { catchApiError } from '@mobile/modules/commons/error';
import {
  endLoading,
  startLoading,
  withLoading,
} from '@mobile/modules/commons/loading';

import {
  ExpRequestList,
  SearchConditions,
} from '@apps/domain/models/exp/request/Report';

import { actions as depListActions } from '@mobile/modules/approval/entities/expense/advSearch/departmentList';
import {
  actions as empListActions,
  OptionList,
} from '@mobile/modules/approval/entities/expense/advSearch/employeeList';
import { actions as preRequestIdListActions } from '@mobile/modules/approval/entities/expense/preRequestIdList';
import { actions as preRequestListActions } from '@mobile/modules/approval/entities/expense/preRequestList';
import { actions as expRequestIdListActions } from '@mobile/modules/approval/entities/expense/requestIdList';
import { actions as expRequestListActions } from '@mobile/modules/approval/entities/expense/requestList';
import { actions as listActions } from '@mobile/modules/approval/entities/list';

import { AppDispatch } from '../AppThunk';

export const fetchApprRequestList = () => {
  return (dispatch: AppDispatch) => {
    return dispatch(withLoading(listActions.list())).catch((err) => {
      dispatch(catchApiError(err));
      throw err;
    });
  };
};

export const fetchExpRequestList =
  (
    requestIds: string[],
    empId: string,
    isExpense: boolean,
    isUpdate?: boolean,
    withLoad?: boolean
  ) =>
  (dispatch: AppDispatch): Promise<ExpRequestList | void> => {
    const action = isExpense ? expRequestListActions : preRequestListActions;
    const fetchAction = action.fetch(requestIds, empId, isUpdate);
    const fetchPromise = withLoad
      ? dispatch(withLoading(fetchAction))
      : dispatch(fetchAction);
    return fetchPromise.catch((err) => {
      dispatch(catchApiError(err, { isContinuable: true }));
      throw err;
    });
  };

export const fetchExpRequestIds =
  (
    searchCondition: SearchConditions,
    empId: string,
    isExpense: boolean,
    isBackgroundLoad: boolean
  ) =>
  (dispatch: AppDispatch): Promise<Array<string> | void> => {
    const action = isExpense
      ? expRequestIdListActions
      : preRequestIdListActions;
    let loadingId;
    if (!isBackgroundLoad) {
      loadingId = dispatch(startLoading());
    }
    return dispatch(action.fetchIds(searchCondition, empId))
      .catch((err) => {
        dispatch(catchApiError(err, { isContinuable: true }));
      })
      .finally(() => {
        loadingId && dispatch(endLoading(loadingId));
      });
  };

export const resetExpRequestIds =
  (isExpense: boolean) => (dispatch: AppDispatch) => {
    const resetAction = isExpense
      ? expRequestIdListActions
      : preRequestIdListActions;
    dispatch(resetAction.clear());
  };

export const resetExpRequestList =
  (isExpense: boolean) => (dispatch: AppDispatch) => {
    const resetAction = isExpense
      ? expRequestListActions
      : preRequestListActions;
    dispatch(resetAction.clear());
  };

export const fetchEmpList =
  (
    companyId?: string,
    targetDate?: string,
    limitNumber?: number,
    prevSelectedOptions?: OptionList,
    withLoad?: boolean
  ) =>
  (dispatch: AppDispatch) => {
    if (withLoad) {
      return dispatch(
        withLoading(
          empListActions.fetchList(
            companyId,
            targetDate,
            limitNumber,
            prevSelectedOptions
          )
        )
      );
    }
    return dispatch(
      empListActions.fetchList(
        companyId,
        targetDate,
        limitNumber,
        prevSelectedOptions
      )
    );
  };

export const searchEmployee =
  (
    companyId?: string,
    targetDate?: string,
    limitNumber?: number,
    searchQuery?: string,
    isWithLoading?: boolean
  ) =>
  (dispatch: AppDispatch) => {
    const searchAction = empListActions.search(
      companyId,
      targetDate,
      limitNumber,
      searchQuery
    );
    const action = isWithLoading ? withLoading(searchAction) : searchAction;
    return dispatch(action);
  };

export const fetchDeprtmentList =
  (
    companyId?: string,
    targetDate?: string,
    limitNumber?: number,
    detailSelector?: string[],
    prevSelectedOptions?: OptionList,
    withLoad?: boolean
  ) =>
  (dispatch: AppDispatch) => {
    if (withLoad) {
      return dispatch(
        withLoading(
          depListActions.fetchList(
            companyId,
            targetDate,
            limitNumber,
            detailSelector,
            prevSelectedOptions
          )
        )
      );
    }
    return dispatch(
      depListActions.fetchList(
        companyId,
        targetDate,
        limitNumber,
        detailSelector,
        prevSelectedOptions
      )
    );
  };

export const searchDepartment =
  (
    companyId?: string,
    targetDate?: string,
    limitNumber?: number,
    detailSelector?: string[],
    searchQuery?: string,
    isWithLoading?: boolean
  ) =>
  (dispatch: AppDispatch) => {
    const searchAction = depListActions.search(
      companyId,
      targetDate,
      limitNumber,
      detailSelector,
      searchQuery
    );
    const action = isWithLoading ? withLoading(searchAction) : searchAction;
    return dispatch(action);
  };
