import { Reducer } from 'redux';

import {
  ExpenseTypeList,
  ExpenseTypeListResult,
  getExpenseTypeById,
  getExpenseTypeList,
  getRecentlyUsed,
  searchExpenseType,
} from '../../../models/exp/ExpenseType';

import { AppDispatch } from '../AppThunk';

export const ACTIONS = {
  GET_SUCCESS: 'MODULES/ENTITIES/EXP/EXPENSES_TYPE/GET_SUCCESS',
};

const getSuccess = (res: ExpenseTypeList) => ({
  type: ACTIONS.GET_SUCCESS,
  payload: res,
});

export const actions = {
  list:
    (
      empId: string,
      parentGroupId: string,
      targetDate: string,
      recordType: string,
      usedIn: string | undefined,
      expReportTypeId?: string,
      excludedRecordTypes?: string[],
      empHistoryId?: string
    ) =>
    (dispatch: AppDispatch): void | any => {
      return getExpenseTypeList(
        empId,
        parentGroupId,
        targetDate,
        recordType,
        usedIn,
        expReportTypeId,
        false,
        excludedRecordTypes,
        empHistoryId
      )
        .then((res: ExpenseTypeList) => dispatch(getSuccess(res)))
        .catch((err) => {
          throw err;
        });
    },

  getRecentlyUsed:
    (
      employeeBaseId: string,
      companyId: string,
      targetDate?: string,
      recordType?: string,
      reportTypeId?: string,
      usedIn?: string,
      excludedRecordTypes?: string[]
    ) =>
    (
      dispatch: AppDispatch
    ): Promise<{ payload: ExpenseTypeList; type: string }> => {
      return getRecentlyUsed(
        employeeBaseId,
        companyId,
        targetDate,
        recordType,
        reportTypeId,
        usedIn,
        true,
        excludedRecordTypes
      )
        .then((res: ExpenseTypeList) => dispatch(getSuccess(res)))
        .catch((err) => {
          throw err;
        });
    },

  searchExpenseType:
    (
      companyId?: string,
      keyword?: string,
      targetDate?: string,
      usedIn?: string,
      expReportTypeId?: string,
      recordType?: string,
      empId?: string,
      limitNumber?: number,
      excludedRecordTypes?: string[],
      empHistoryId?: string
    ) =>
    (dispatch: AppDispatch): Promise<ExpenseTypeListResult> => {
      return searchExpenseType(
        companyId,
        keyword,
        targetDate,
        usedIn,
        expReportTypeId,
        true,
        recordType,
        false,
        empId,
        limitNumber,
        excludedRecordTypes,
        empHistoryId
      )
        .then((res: ExpenseTypeListResult) => {
          dispatch(getSuccess(res.records));
          return res;
        })
        .catch((err) => {
          throw err;
        });
    },

  getExpenseTypeById:
    (expTypeId: string, usedIn: string, empHistoryId?: string) =>
    (dispatch: AppDispatch): void | any => {
      return getExpenseTypeById(expTypeId, usedIn, empHistoryId)
        .then((res: any) => {
          dispatch(getSuccess(res));
          return res[0];
        })
        .catch((err) => {
          throw err;
        });
    },
};

const initialState = [];

export default ((state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.GET_SUCCESS:
      const expTypeList = state.concat(action.payload);
      const updatedExpTypeList = expTypeList.reduce((arr, expType) => {
        const idx = arr.findIndex((arrExpType) => arrExpType.id === expType.id);
        if (idx > -1) {
          arr.splice(idx, 1, expType);
        } else {
          arr.push(expType);
        }
        return arr;
      }, []);

      return updatedExpTypeList;
    default:
      return state;
  }
}) as Reducer<ExpenseTypeList, any>;
