import { Reducer } from 'redux';

import { CurrencyCodeList } from '@apps/domain/models/exp/foreign-currency/Currency';

import { FETCH_CURRENCY_CODE_LIST } from '../actions/currencyCodeList';

const currencyListReducer = (state = [], action) => {
  switch (action.type) {
    case FETCH_CURRENCY_CODE_LIST:
      return action.payload;
    default:
      return state;
  }
};

export default currencyListReducer as Reducer<CurrencyCodeList, any>;
