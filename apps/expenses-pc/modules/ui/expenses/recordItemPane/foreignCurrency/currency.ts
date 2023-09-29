import { Reducer } from 'redux';

import {
  catchApiError,
  loadingEnd,
  loadingStart,
} from '../../../../../../commons/actions/app';

import {
  CurrencyList,
  searchCurrency,
} from '../../../../../../domain/models/exp/foreign-currency/Currency';

import { AppDispatch } from '../../../../AppThunk';

export const ACTIONS = {
  SEARCH_SUCCESS:
    'MODULES/EXPENSES/RECORD_ITEM_PANE/FOREIGN_CURRENCY/CURRENCY/SEARCH_SUCCESS',
};

const searchSuccess = (result: any) => ({
  type: ACTIONS.SEARCH_SUCCESS,
  payload: result.records,
});

export const actions = {
  search:
    (companyId: string, loadInbackground: boolean) =>
    (dispatch: AppDispatch): void | any => {
      let currencyRecords = [];
      if (!loadInbackground) {
        dispatch(loadingStart());
      }
      return searchCurrency(companyId)
        .then((res: any) => {
          currencyRecords = res.records;
          dispatch(searchSuccess(res));
          return currencyRecords;
        })
        .catch((err) => {
          dispatch(catchApiError(err, { isContinuable: true }));
          throw err;
        })
        .finally(() => {
          if (!loadInbackground) {
            dispatch(loadingEnd());
          }
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
