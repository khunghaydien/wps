import * as base from './base';

const FUNC_NAME = 'currency';
export const SEARCH_CURRENCY = 'SEARCH_CURRENCY';
export const CREATE_CURRENCY = 'CREATE_CURRENCY';
export const DELETE_CURRENCY = 'DELETE_CURRENCY';
export const UPDATE_CURRENCY = 'UPDATE_CURRENCY';
export const SEARCH_ISO_CURRENCY_CODE = 'SEARCH_ISO_CURRENCY_CODE';
export const SEARCH_CURRENCY_ERROR = 'SEARCH_CURRENCY_ERROR';
export const CREATE_CURRENCY_ERROR = 'CREATE_CURRENCY_ERROR';
export const DELETE_CURRENCY_ERROR = 'DELETE_CURRENCY_ERROR';
export const UPDATE_CURRENCY_ERROR = 'UPDATE_CURRENCY_ERROR';
export const SEARCH_ISO_CURRENCY_CODE_ERROR = 'SEARCH_ISO_CURRENCY_CODE_ERROR';

export const searchCurrency = (param = {}) => {
  return base.search(FUNC_NAME, param, SEARCH_CURRENCY, SEARCH_CURRENCY_ERROR);
};

export const createCurrency = (param) => {
  return base.create(FUNC_NAME, param, CREATE_CURRENCY, CREATE_CURRENCY_ERROR);
};

export const deleteCurrency = (param) => {
  return base.del(FUNC_NAME, param, DELETE_CURRENCY, DELETE_CURRENCY_ERROR);
};

export const updateCurrency = (param) => {
  return base.update(FUNC_NAME, param, UPDATE_CURRENCY, UPDATE_CURRENCY_ERROR);
};

export const searchIsoCurrencyCode = (param = {}) => {
  return base.search(
    `${FUNC_NAME}/iso-code-list`,
    param,
    SEARCH_ISO_CURRENCY_CODE,
    SEARCH_ISO_CURRENCY_CODE_ERROR
  );
};
