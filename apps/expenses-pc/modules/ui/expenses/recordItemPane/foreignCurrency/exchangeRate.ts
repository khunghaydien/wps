import { Reducer } from 'redux';

import { merge } from 'lodash';

import {
  catchApiError,
  loadingEnd,
  loadingStart,
} from '../../../../../../commons/actions/app';

import {
  ExchangeRateList,
  searchExchangeRate,
} from '../../../../../../domain/models/exp/foreign-currency/ExchangeRate';

import { AppDispatch } from '../../../../AppThunk';

export const ACTIONS = {
  SEARCH_SUCCESS:
    'MODULES/EXPENSES/RECORD_ITEM_PANE/FOREIGN_CURRENCY/EXCHANGE_RATE/SEARCH_SUCCESS',
};

const searchSuccess = (currencyId, recordDate, result: any) => ({
  type: ACTIONS.SEARCH_SUCCESS,
  payload: { [currencyId]: { [recordDate]: result.records[0] } },
});

export const actions = {
  search: (
    companyId: string,
    currencyId: string,
    recordDate: string,
    loadingArea?: string,
    loadInBackground?: boolean
  ) => {
    return (dispatch: AppDispatch) => {
      let rate = 0;
      if (!loadInBackground) {
        const payload = loadingArea ? { areas: loadingArea } : null;
        dispatch(loadingStart(payload));
      }
      return searchExchangeRate(companyId, currencyId, recordDate)
        .then((res: any) => {
          // get rate from api if exist, else default to 0.
          rate = res.records[0] ? res.records[0].calculationRate : 0;
          if (!loadInBackground) {
            dispatch(loadingEnd(loadingArea));
          }
          dispatch(searchSuccess(currencyId, recordDate, res));
          return rate;
        })
        .catch((err) => {
          if (!loadInBackground) {
            dispatch(loadingEnd(loadingArea));
          }
          dispatch(catchApiError(err, { isContinuable: true }));
          throw err;
        });
    };
  },
};

// Reducer
const initialState = {};

type Props = {
  [key: string]: ExchangeRateList;
};

export default ((state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.SEARCH_SUCCESS:
      return merge(state, action.payload);
    default:
      return state;
  }
}) as Reducer<Props, any>;
