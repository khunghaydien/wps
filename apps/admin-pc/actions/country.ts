import * as base from './base';

const FUNC_NAME = 'country';
export const SEARCH_COUNTRY = 'SEARCH_COUNTRY';
export const CREATE_COUNTRY = 'CREATE_COUNTRY';
export const DELETE_COUNTRY = 'DELETE_COUNTRY';
export const UPDATE_COUNTRY = 'UPDATE_COUNTRY';
export const SEARCH_COUNTRY_ERROR = 'SEARCH_COUNTRY_ERROR';
export const CREATE_COUNTRY_ERROR = 'CREATE_COUNTRY_ERROR';
export const DELETE_COUNTRY_ERROR = 'DELETE_COUNTRY_ERROR';
export const UPDATE_COUNTRY_ERROR = 'UPDATE_COUNTRY_ERROR';

export const searchCountry = (param = {}) => {
  return base.search(FUNC_NAME, param, SEARCH_COUNTRY, SEARCH_COUNTRY_ERROR);
};

export const createCountry = (param) => {
  return base.create(FUNC_NAME, param, CREATE_COUNTRY, CREATE_COUNTRY_ERROR);
};

export const deleteCountry = (param) => {
  return base.del(FUNC_NAME, param, DELETE_COUNTRY, DELETE_COUNTRY_ERROR);
};

export const updateCountry = (param) => {
  return base.update(FUNC_NAME, param, UPDATE_COUNTRY, UPDATE_COUNTRY_ERROR);
};
