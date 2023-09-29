import { Reducer } from 'redux';

import {
  getTransactionHistory,
  TransactionList,
} from '@apps/domain/models/exp/CreditCard';

import { AppDispatch } from '../AppThunk';

export const ACTIONS = {
  GET_SUCCESS: 'MODULES/EXPENSE/ENTITIES/CC_TRANSACTIONS/GET',
};

const getSuccess = (body: TransactionList) => ({
  type: ACTIONS.GET_SUCCESS,
  payload: body,
});

export const actions = {
  get:
    (companyId: string, empId: string, from: string, to: string) =>
    (
      dispatch: AppDispatch
    ): Promise<{ payload: TransactionList; type: string }> => {
      return getTransactionHistory(companyId, empId, from, to)
        .then((res: TransactionList) => dispatch(getSuccess(res)))
        .catch((err) => {
          throw err;
        });
    },
};

const initialState = [];

export default ((state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.GET_SUCCESS:
      return action.payload || [];
    default:
      return state;
  }
}) as Reducer<TransactionList, any>;
