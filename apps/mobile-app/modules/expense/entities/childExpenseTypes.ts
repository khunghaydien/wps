import { Reducer } from 'redux';

import {
  catchApiError,
  loadingEnd,
  loadingStart,
} from '../../../../commons/actions/app';

import {
  ExpenseTypeList,
  searchExpTypesByParentRecord,
} from '@apps/domain/models/exp/ExpenseType';

import { AppDispatch } from '../AppThunk';

export type ExpTypesInfo = { recordType?: { targetDate: ExpenseTypeList } };

export const ACTIONS = {
  SEARCH_SUCCESS: 'MODULES/EXPENSE/ENTITIES/CHILD_EXPENSE_TYPES/SEARCH_SUCCESS',
};

const searchByParentSuccess = (resObj: ExpTypesInfo) => ({
  type: ACTIONS.SEARCH_SUCCESS,
  payload: resObj,
});

export const actions = {
  searchByParent:
    (targetDate: string, parentTypeId: string, usedIn: string) =>
    (dispatch: AppDispatch): void | any => {
      dispatch(loadingStart());
      return searchExpTypesByParentRecord(targetDate, parentTypeId, usedIn)
        .then((res: ExpenseTypeList) => {
          const resObj = {
            [`${parentTypeId}.${targetDate}`]: res,
          };
          dispatch(searchByParentSuccess(resObj));
          return res;
        })
        .catch((err) => {
          dispatch(catchApiError(err, { isContinuable: true }));
          throw err;
        })
        .finally(() => dispatch(loadingEnd()));
    },
};

const initialState = {};

export default ((state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.SEARCH_SUCCESS:
      return action.payload;
    default:
      return state;
  }
}) as Reducer<ExpTypesInfo, any>;
