import { Reducer } from 'redux';

import merge from 'lodash/merge';
import moment from 'moment';

import {
  ExchangeRate,
  searchExchangeRate,
} from '../../../../domain/models/exp/foreign-currency/ExchangeRate';

import { AppDispatch } from '../AppThunk';

export const ACTIONS = {
  SEARCH_SUCCESS: 'MODULES/EXPENSE/ENTITIES/EXCHANGE_RATE/SEARCH_SUCCESS',
};

const searchSuccess = (currencyId, recordDate, result: any) => ({
  type: ACTIONS.SEARCH_SUCCESS,
  payload: { [currencyId]: { [recordDate]: result.records[0] } },
});

export const actions = {
  search: (companyId: string, currencyId: string, recordDate?: string) => {
    return (dispatch: AppDispatch): Promise<number> => {
      const date = recordDate || moment(new Date()).format('YYYY-MM-DD');
      let rate = 0;
      return searchExchangeRate(companyId, currencyId, date)
        .then((res: any) => {
          // get rate from api if exist, else default to 0.
          rate = res.records[0] ? res.records[0].calculationRate : 0;
          dispatch(searchSuccess(currencyId, date, res));
          return rate;
        })
        .catch((err) => {
          throw err;
        });
    };
  },
};

// Reducer
const initialState = {};

export type Props = {
  [key: string]: {
    [key: string]: ExchangeRate;
  };
};

export default ((state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.SEARCH_SUCCESS:
      return merge({}, state, action.payload);
    default:
      return state;
  }
}) as Reducer<Props, any>;
