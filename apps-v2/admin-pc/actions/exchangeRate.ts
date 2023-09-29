import {
  catchApiError,
  loadingEnd,
  loadingStart,
} from '../../commons/actions/app';
import Api from '../../commons/api';

import * as base from './base';

const FUNC_NAME = 'exp/exchange-rate';
export const SEARCH_EXCHANGE_RATE = 'SEARCH_EXCHANGE_RATE';
export const CREATE_EXCHANGE_RATE = 'CREATE_EXCHANGE_RATE';
export const DELETE_EXCHANGE_RATE = 'DELETE_EXCHANGE_RATE';
export const UPDATE_EXCHANGE_RATE = 'UPDATE_EXCHANGE_RATE';
export const GET_CURRENCY_PAIR = 'GET_CURRENCY_PAIR';
export const SEARCH_EXCHANGE_RATE_ERROR = 'SEARCH_EXCHANGE_RATE_ERROR';
export const CREATE_EXCHANGE_RATE_ERROR = 'CREATE_EXCHANGE_RATE_ERROR';
export const DELETE_EXCHANGE_RATE_ERROR = 'DELETE_EXCHANGE_RATE_ERROR';
export const UPDATE_EXCHANGE_RATE_ERROR = 'UPDATE_EXCHANGE_RATE_ERROR';
export const GET_CURRENCY_PAIR_ERROR = 'GET_CURRENCY_PAIR_ERROR';

export const searchExchangeRate = (param = {}) => {
  return base.search(
    FUNC_NAME,
    param,
    SEARCH_EXCHANGE_RATE,
    SEARCH_EXCHANGE_RATE_ERROR
  );
};

export const createExchangeRate = (param) => {
  return base.create(
    FUNC_NAME,
    param,
    CREATE_EXCHANGE_RATE,
    CREATE_EXCHANGE_RATE_ERROR
  );
};

export const deleteExchangeRate = (param) => {
  return base.del(
    FUNC_NAME,
    param,
    DELETE_EXCHANGE_RATE,
    DELETE_EXCHANGE_RATE_ERROR
  );
};

export const updateExchangeRate = (param) => {
  return base.update(
    FUNC_NAME,
    param,
    UPDATE_EXCHANGE_RATE,
    UPDATE_EXCHANGE_RATE_ERROR
  );
};

export const getCurrencyPair = () => (dispatch) => {
  dispatch(loadingStart());
  return Api.invoke({ path: `/${FUNC_NAME}/currency-pair/get` })
    .then((result) => {
      dispatch(loadingEnd());
      dispatch({
        type: GET_CURRENCY_PAIR,
        payload: result.records,
      });
    })
    .catch((err) => {
      dispatch(loadingEnd());
      dispatch({
        type: GET_CURRENCY_PAIR_ERROR,
      });
      dispatch(catchApiError(err, { isContinuable: true }));
      throw err;
    });
};
