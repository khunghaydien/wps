import * as base from './base';
import * as history from './history';

const FUNC_NAME = 'exp/tax-type';
export const SEARCH_TAX_TYPE = 'SEARCH_TAX_TYPE';
export const SEARCH_PARENT_TAX_TYPE = 'SEARCH_PARENT_TAX_TYPE';
export const CREATE_TAX_TYPE = 'CREATE_TAX_TYPE';
export const DELETE_TAX_TYPE = 'DELETE_TAX_TYPE';
export const UPDATE_TAX_TYPE = 'UPDATE_TAX_TYPE';
export const CREATE_HISTORY_TAX_TYPE = 'CREATE_HISTORY_TAX_TYPE';
export const SEARCH_HISTORY_TAX_TYPE = 'SEARCH_HISTORY_TAX_TYPE';
export const UPDATE_HISTORY_TAX_TYPE = 'UPDATE_HISTORY_TAX_TYPE';
export const DELETE_HISTORY_TAX_TYPE = 'DELETE_HISTORY_TAX_TYPE';
export const SEARCH_TAX_TYPE_ERROR = 'SEARCH_TAX_TYPE_ERROR';
export const SEARCH_PARENT_TAX_TYPE_ERROR = 'SEARCH_PARENT_TAX_TYPE_ERROR';
export const CREATE_TAX_TYPE_ERROR = 'CREATE_TAX_TYPE_ERROR';
export const DELETE_TAX_TYPE_ERROR = 'DELETE_TAX_TYPE_ERROR';
export const UPDATE_TAX_TYPE_ERROR = 'UPDATE_TAX_TYPE_ERROR';
export const CREATE_HISTORY_TAX_TYPE_ERROR = 'CREATE_HISTORY_TAX_TYPE_ERROR';
export const SEARCH_HISTORY_TAX_TYPE_ERROR = 'SEARCH_HISTORY_TAX_TYPE_ERROR';
export const UPDATE_HISTORY_TAX_TYPE_ERROR = 'UPDATE_HISTORY_TAX_TYPE_ERROR';
export const DELETE_HISTORY_TAX_TYPE_ERROR = 'DELETE_HISTORY_TAX_TYPE_ERROR';

export const searchTaxType = (param = {}) => {
  return base.search(FUNC_NAME, param, SEARCH_TAX_TYPE, SEARCH_TAX_TYPE_ERROR);
};

export const createTaxType = (param) => {
  return base.create(FUNC_NAME, param, CREATE_TAX_TYPE, CREATE_TAX_TYPE_ERROR);
};

export const deleteTaxType = (param) => {
  return base.del(FUNC_NAME, param, DELETE_TAX_TYPE, DELETE_TAX_TYPE_ERROR);
};

export const updateTaxType = (param) => {
  return base.update(FUNC_NAME, param, UPDATE_TAX_TYPE, UPDATE_TAX_TYPE_ERROR);
};

export const searchHistoryTaxType = (param = {}) => {
  return history.searchHistory(
    FUNC_NAME,
    param,
    SEARCH_HISTORY_TAX_TYPE,
    SEARCH_HISTORY_TAX_TYPE_ERROR
  );
};

export const createHistoryTaxType = (param) => {
  return history.createHistory(
    FUNC_NAME,
    param,
    CREATE_HISTORY_TAX_TYPE,
    CREATE_HISTORY_TAX_TYPE_ERROR
  );
};

export const updateHistoryTaxType = (param) => {
  return history.updateHistory(
    FUNC_NAME,
    param,
    UPDATE_HISTORY_TAX_TYPE,
    UPDATE_HISTORY_TAX_TYPE_ERROR
  );
};

export const deleteHistoryTaxType = (param) => {
  return history.deleteHistory(
    FUNC_NAME,
    param,
    DELETE_HISTORY_TAX_TYPE,
    DELETE_HISTORY_TAX_TYPE_ERROR
  );
};
