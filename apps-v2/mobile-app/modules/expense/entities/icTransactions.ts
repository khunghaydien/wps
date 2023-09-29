import { Reducer } from 'redux';

import {
  getIcCardTransactionHistory,
  IcTransactionsByCards,
} from '@apps/domain/models/exp/TransportICCard';

import { AppDispatch } from '../AppThunk';

export const ACTIONS = {
  GET_SUCCESS: 'MODULES/EXPENSE/ENTITIES/IC_TRANSACTIONS/GET',
};

const getSuccess = (body: IcTransactionsByCards) => ({
  type: ACTIONS.GET_SUCCESS,
  payload: body,
});

export const actions = {
  get:
    (
      salesId: string,
      customerId: string,
      companyId: string,
      employeeCode: string,
      paymentDateFrom?: string,
      paymentDateTo?: string,
      includeHidden?: boolean,
      includeUsed?: boolean
    ) =>
    (
      dispatch: AppDispatch
    ): Promise<{ payload: IcTransactionsByCards; type: string }> => {
      return getIcCardTransactionHistory(
        salesId,
        customerId,
        companyId,
        employeeCode,
        paymentDateFrom,
        paymentDateTo,
        includeHidden,
        includeUsed
      )
        .then((res: IcTransactionsByCards) => dispatch(getSuccess(res)))
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
}) as Reducer<IcTransactionsByCards, any>;
