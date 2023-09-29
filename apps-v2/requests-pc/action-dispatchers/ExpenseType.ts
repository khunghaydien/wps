import { catchApiError } from '../../commons/actions/app';
import msg from '../../commons/languages';
import { showToast } from '../../commons/modules/toast';

import {
  ExpenseType,
  ExpenseTypeList,
  favoriteExpenseType,
  getFavoriteExpenseTypes,
  unfavoriteExpenseType,
} from '../../domain/models/exp/ExpenseType';

import { actions as childExpenseTypeActions } from '../../domain/modules/exp/expense-type/childList';
import { actions as expenseTypeActions } from '../../domain/modules/exp/expense-type/list';
import { AppDispatch } from '../modules/AppThunk';
import { actions as expenseTypeSelectListActions } from '../modules/ui/expenses/dialog/expenseTypeSelect/list';
import { actions as dialogLoadingActions } from '../modules/ui/expenses/dialog/isLoading';

export const getFavoriteExpTypes =
  (
    empId: string,
    targetDate: string,
    companyId: string,
    reportTypeId: string,
    excludedRecordTypes?: string[]
  ) =>
  (dispatch: AppDispatch) => {
    dispatch(dialogLoadingActions.toggle(true));
    return getFavoriteExpenseTypes(
      empId,
      targetDate,
      'REQUEST',
      companyId,
      '',
      reportTypeId,
      excludedRecordTypes
    )
      .then((expTypeList) => {
        dispatch(expenseTypeSelectListActions.setFavorites(expTypeList));
        return expTypeList;
      })
      .catch((err) => {
        dispatch(catchApiError(err, { isContinuable: true }));
      })
      .finally(() => dispatch(dialogLoadingActions.toggle(false)));
  };

export const favoriteExpType =
  (empId: string, expType: ExpenseType, companyId: string) =>
  (dispatch: AppDispatch) => {
    dispatch(expenseTypeSelectListActions.favorite(expType));
    return favoriteExpenseType(empId, expType.id, 'ExpenseType', companyId)
      .then(() => {
        dispatch(
          showToast(`${expType.name}${msg().Exp_Msg_AddedToFavorites}`, 3000)
        );
      })
      .catch((err) => {
        dispatch(expenseTypeSelectListActions.unfavorite(expType.id));
        dispatch(catchApiError(err, { isContinuable: true }));
        throw err;
      });
  };

export const unfavoriteExpType =
  (empId: string, expType: ExpenseType, companyId: string) =>
  (dispatch: AppDispatch) => {
    dispatch(expenseTypeSelectListActions.unfavorite(expType.id));
    return unfavoriteExpenseType(
      empId,
      expType.id,
      'ExpenseType',
      companyId
    ).catch((err) => {
      dispatch(expenseTypeSelectListActions.favorite(expType));
      dispatch(catchApiError(err, { isContinuable: true }));
      throw err;
    });
  };

export const getExpenseTypeList =
  (
    recordType = '',
    targetDate: string,
    reportTypeId?: string,
    empHistoryId?: string,
    excludedRecordTypes?: string[]
  ) =>
  (dispatch: AppDispatch) => {
    dispatch(dialogLoadingActions.toggle(true));
    return dispatch(
      expenseTypeActions.list(
        null,
        null,
        targetDate,
        recordType,
        'REQUEST',
        reportTypeId,
        excludedRecordTypes,
        empHistoryId
      )
    )
      .then((result) => {
        dispatch(expenseTypeSelectListActions.set([result.payload]));
      })
      .catch((err) => dispatch(catchApiError(err, { isContinuable: true })))
      .then(() => dispatch(dialogLoadingActions.toggle(false)));
  };

export const getExpenseTypeSearchResult =
  (
    companyId: string,
    keyword: string,
    targetDate: string,
    expReportTypeId: string,
    recordtype: string | undefined,
    empId: string,
    empHistoryId?: string,
    excludedRecordTypes?: string[]
  ) =>
  (dispatch: AppDispatch) => {
    dispatch(dialogLoadingActions.toggle(true));
    return dispatch(
      expenseTypeActions.searchExpenseType(
        companyId,
        keyword,
        targetDate,
        'REQUEST',
        expReportTypeId,
        recordtype,
        empId,
        100,
        excludedRecordTypes,
        empHistoryId
      )
    )
      .then((result) => {
        dispatch(expenseTypeSelectListActions.setSearchResult(result));
      })
      .catch((err) => dispatch(catchApiError(err, { isContinuable: true })))
      .then(() => dispatch(dialogLoadingActions.toggle(false)));
  };

export const getExpenseTypeById =
  (expTypeId: string, empHistoryId?: string) => (dispatch: AppDispatch) => {
    return dispatch(
      expenseTypeActions.getExpenseTypeById(expTypeId, 'REQUEST', empHistoryId)
    )
      .then((result) => {
        return result;
      })
      .catch((err) => {
        dispatch(catchApiError(err, { isContinuable: true }));
      });
  };

/**
 * e.g. In category list of expense type dialog, click expense type group to fetch exp types
 *
 * @param {ExpenseType} item
 * @param {ExpenseTypeList} items
 * @param {?string} recordType
 * @param {string} [reportTypeId]
 */
export const getNextExpenseTypeList =
  (
    item: ExpenseType,
    items: ExpenseTypeList,
    targetDate: string,
    recordType?: string,
    reportTypeId?: string,
    empHistoryId?: string
  ) =>
  (dispatch: AppDispatch) => {
    dispatch(dialogLoadingActions.toggle(true));
    return dispatch(
      expenseTypeActions.list(
        null,
        item.id,
        targetDate,
        recordType,
        'REQUEST',
        reportTypeId,
        undefined,
        empHistoryId
      )
    )
      .then((result) => {
        items.push(result.payload);
        dispatch(expenseTypeSelectListActions.set(items));
      })
      .catch((err) => dispatch(catchApiError(err, { isContinuable: true })))
      .finally(() => dispatch(dialogLoadingActions.toggle(false)));
  };

/**
 * e.g. Search exp types that are linked to hotel fee exp type
 *
 * @param {string} targetDate
 * @param {string} parentExpTypeId
 */
export const searchExpTypesByParentRecord =
  (targetDate: string, parentExpTypeId: string, loadInBackground?: boolean) =>
  (dispatch: AppDispatch) => {
    return dispatch(
      childExpenseTypeActions.searchByParent(
        targetDate,
        parentExpTypeId,
        'REQUEST',
        loadInBackground
      )
    );
  };
