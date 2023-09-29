import { catchApiError } from '../../commons/actions/app';

import { actions as jobActions } from '../../domain/modules/exp/job/list';
import { AppDispatch } from '../modules/AppThunk';
import { actions as dialogLoadingActions } from '../modules/ui/expenses/dialog/isLoading';
import { actions as jobSelectListActions } from '../modules/ui/expenses/dialog/jobSelect/list';

export const getJobList =
  (
    parentId?: string,
    targetDate?: string,
    empId?: string,
    empHistoryId?: string
  ) =>
  (dispatch: AppDispatch) => {
    dispatch(dialogLoadingActions.toggle(true));
    return dispatch(jobActions.list(parentId, targetDate, empId, empHistoryId))
      .then((result) => {
        dispatch(jobSelectListActions.set([result.payload]));
      })
      .catch((err) => dispatch(catchApiError(err, { isContinuable: true })))
      .then(() => dispatch(dialogLoadingActions.toggle(false)));
  };

export const getRecentJobs =
  (targetDate: string, empId: string, companyId: string) =>
  (dispatch: AppDispatch) => {
    return dispatch(jobActions.getRecentlyUsed(targetDate, empId, companyId))
      .then((result) => {
        dispatch(jobSelectListActions.setRecentResult(result.payload));
        return result.payload;
      })
      .catch((err) => {
        dispatch(catchApiError(err, { isContinuable: true }));
        return [];
      });
  };
export const searchJobs =
  (
    keyword: string,
    targetDate: string,
    employeeId: string,
    companyId?: string,
    empHistoryId?: string
  ) =>
  (dispatch: AppDispatch) => {
    return dispatch(
      jobActions.getJobSearchResult(
        keyword,
        targetDate,
        employeeId,
        'REPORT',
        companyId,
        empHistoryId
      )
    )
      .then((result) => {
        dispatch(jobSelectListActions.setSearchResult(result.payload));
        return result.payload;
      })
      .catch((err) => {
        dispatch(catchApiError(err, { isContinuable: true }));
        return [];
      });
  };

export const getJobSearchResult =
  (
    keyword: string,
    targetDate: string,
    employeeId: string,
    companyId?: string,
    empHistoryId?: string
  ) =>
  (dispatch: AppDispatch) => {
    dispatch(dialogLoadingActions.toggle(true));
    return dispatch(
      searchJobs(keyword, targetDate, employeeId, companyId, empHistoryId)
    ).then(() => dispatch(dialogLoadingActions.toggle(false)));
  };

export const getNextJobList =
  (
    item: any,
    items: any,
    parentId: string,
    targetDate: string,
    empId?: string
  ) =>
  (dispatch: AppDispatch) => {
    dispatch(dialogLoadingActions.toggle(true));
    return dispatch(jobActions.list(parentId, targetDate, empId))
      .then((result) => {
        items.push(result.payload);
        dispatch(jobSelectListActions.set(items));
      })
      .catch((err) => dispatch(catchApiError(err, { isContinuable: true })))
      .then(() => dispatch(dialogLoadingActions.toggle(false)));
  };
