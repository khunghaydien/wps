import { withLoading } from '../../modules/commons/loading';

import { RECORD_TYPE } from '@apps/domain/models/exp/Record';

import { AppDispatch } from '../../modules/expense/AppThunk';
import { actions as childExpenseTypesActions } from '../../modules/expense/entities/childExpenseTypes';
import { actions as expenseTypeListActions } from '../../modules/expense/entities/expenseTypeList';

/**
 * List expense types
 *
 * @param {?string} empId
 * @param {?string} parentGroupId
 * @param {?string} targetDate
 * @param {?string} recordType
 */
export const getExpenseTypeList =
  (
    empId?: string,
    parentGroupId?: string,
    targetDate?: string,
    recordType?: string,
    expReportTypeId?: string,
    isRequest?: boolean,
    empHistoryId?: string,
    excludedRecordTypes?: string[]
  ) =>
  (dispatch: AppDispatch) =>
    dispatch(
      withLoading(
        expenseTypeListActions.get(
          empId,
          parentGroupId,
          targetDate,
          recordType,
          expReportTypeId,
          isRequest,
          empHistoryId,
          excludedRecordTypes
        )
      )
    );

/**
 * Search expense type by code and name
 *
 * @param {string} companyId
 * @param {?string} keyword keyword to search in code or name
 * @param {?string} targetDate
 */
export const searchExpenseType =
  (
    companyId: string,
    keyword: string,
    targetDate: string,
    recordType: string | undefined,
    expReportTypeId: string,
    isRequest?: boolean,
    excludedRecordTypes?: string[]
  ) =>
  (dispatch: AppDispatch) =>
    dispatch(
      withLoading(
        expenseTypeListActions.search(
          companyId,
          keyword,
          targetDate,
          recordType,
          expReportTypeId,
          isRequest,
          excludedRecordTypes
        )
      )
    );

export const getJorudanExpenseType =
  (
    companyId: string,
    targetDate: string,
    expReportTypeId?: string,
    isRequest?: boolean
  ) =>
  (dispatch: AppDispatch) => {
    dispatch(
      withLoading(
        expenseTypeListActions.searchWithType(
          companyId,
          targetDate,
          RECORD_TYPE.TransitJorudanJP,
          false,
          expReportTypeId,
          isRequest
        )
      )
    );
  };

export const getExpenseTypeById =
  (expTypeId: string, usedIn: string) => (dispatch: AppDispatch) =>
    dispatch(
      withLoading(expenseTypeListActions.getExpenseTypeById(expTypeId, usedIn))
    );

/**
 * e.g. Search exp types that are linked to hotel fee exp type
 *
 * @param {string} targetDate
 * @param {string} parentExpTypeId
 */
export const searchExpTypesByParentRecord =
  (targetDate: string, parentExpTypeId: string) => (dispatch: AppDispatch) => {
    return dispatch(
      withLoading(
        childExpenseTypesActions.searchByParent(
          targetDate,
          parentExpTypeId,
          'REPORT'
        )
      )
    );
  };
