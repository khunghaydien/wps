import { Reducer } from 'redux';

import { set } from 'lodash';

import { loadingEnd, loadingStart } from '../../../../commons/actions/app';

import {
  ExpenseTypeList,
  searchExpTypesByParentRecord,
} from '../../../models/exp/ExpenseType';

import { AppDispatch } from '../AppThunk';

export type ExpTypesInfo = { recordType?: { targetDate: ExpenseTypeList } };

export const ACTIONS = {
  SEARCH_SUCCESS: 'MODULES/ENTITIES/EXP/EXPENSES_TYPE/SEARCH_SUCCESS',
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
        .then((res: any) => {
          const resObj = {};
          set(resObj, `${parentTypeId}.${targetDate}`, res);
          dispatch(searchByParentSuccess(resObj));
          return res;
        })
        .catch((err) => {
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
