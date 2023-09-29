import { Reducer } from 'redux';

import {
  CurrencyList,
  searchCurrency,
} from '../../../../domain/models/exp/foreign-currency/Currency';

import { AppDispatch } from '../AppThunk';

export const ACTIONS = {
  SEARCH_SUCCESS: 'MODULES/ENTITIES/EXP/FOREIGN_CURRENCY/SEARCH_SUCCESS',
};

const searchSuccess = (result: any) => ({
  type: ACTIONS.SEARCH_SUCCESS,
  payload: result.records,
});

export const actions = {
  search:
    (companyId: string) =>
    (dispatch: AppDispatch): Promise<CurrencyList> => {
      let currencyRecords = [];
      return searchCurrency(companyId)
        .then((res: any) => {
          currencyRecords = res.records;
          dispatch(searchSuccess(res));
          return currencyRecords;
        })
        .catch((err) => {
          throw err;
        });
    },
};

// Reducer
const initialState = [];

export default ((state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.SEARCH_SUCCESS:
      return [...action.payload];
    default:
      return state;
  }
}) as Reducer<CurrencyList, any>;
