import * as base from './base';
import * as history from './history';

const FUNC_NAME = 'cost-center';
export const SEARCH_COST_CENTER = 'SEARCH_COST_CENTER';
export const SEARCH_PARENT_COST_CENTER = 'SEARCH_PARENT_COST_CENTER';
export const CREATE_COST_CENTER = 'CREATE_COST_CENTER';
export const DELETE_COST_CENTER = 'DELETE_COST_CENTER';
export const UPDATE_COST_CENTER = 'UPDATE_COST_CENTER';
export const CREATE_HISTORY_COST_CENTER = 'CREATE_HISTORY_COST_CENTER';
export const SEARCH_HISTORY_COST_CENTER = 'SEARCH_HISTORY_COST_CENTER';
export const UPDATE_HISTORY_COST_CENTER = 'UPDATE_HISTORY_COST_CENTER';
export const DELETE_HISTORY_COST_CENTER = 'DELETE_HISTORY_COST_CENTER';
export const SEARCH_COST_CENTER_ERROR = 'SEARCH_COST_CENTER_ERROR';
export const SEARCH_PARENT_COST_CENTER_ERROR =
  'SEARCH_PARENT_COST_CENTER_ERROR';
export const CREATE_COST_CENTER_ERROR = 'CREATE_COST_CENTER_ERROR';
export const DELETE_COST_CENTER_ERROR = 'DELETE_COST_CENTER_ERROR';
export const UPDATE_COST_CENTER_ERROR = 'UPDATE_COST_CENTER_ERROR';
export const CREATE_HISTORY_COST_CENTER_ERROR =
  'CREATE_HISTORY_COST_CENTER_ERROR';
export const SEARCH_HISTORY_COST_CENTER_ERROR =
  'SEARCH_HISTORY_COST_CENTER_ERROR';
export const UPDATE_HISTORY_COST_CENTER_ERROR =
  'UPDATE_HISTORY_COST_CENTER_ERROR';
export const DELETE_HISTORY_COST_CENTER_ERROR =
  'DELETE_HISTORY_COST_CENTER_ERROR';

export const searchCostCenter = (param = {}) => {
  return base.search(
    FUNC_NAME,
    param,
    SEARCH_COST_CENTER,
    SEARCH_COST_CENTER_ERROR
  );
};

export const searchParentCostCenter = (param = {}) => {
  return base.search(
    FUNC_NAME,
    param,
    SEARCH_PARENT_COST_CENTER,
    SEARCH_PARENT_COST_CENTER_ERROR
  );
};

export const createCostCenter = (param) => {
  return base.create(
    FUNC_NAME,
    param,
    CREATE_COST_CENTER,
    CREATE_COST_CENTER_ERROR
  );
};

export const deleteCostCenter = (param) => {
  return base.del(
    FUNC_NAME,
    param,
    DELETE_COST_CENTER,
    DELETE_COST_CENTER_ERROR
  );
};

export const updateCostCenter = (param) => {
  return base.update(
    FUNC_NAME,
    param,
    UPDATE_COST_CENTER,
    UPDATE_COST_CENTER_ERROR
  );
};

export const searchHistoryCostCenter = (param = {}) => {
  return history.searchHistory(
    FUNC_NAME,
    param,
    SEARCH_HISTORY_COST_CENTER,
    SEARCH_HISTORY_COST_CENTER_ERROR
  );
};

export const createHistoryCostCenter = (param) => {
  return history.createHistory(
    FUNC_NAME,
    param,
    CREATE_HISTORY_COST_CENTER,
    CREATE_HISTORY_COST_CENTER_ERROR
  );
};

export const updateHistoryCostCenter = (param) => {
  return history.updateHistory(
    FUNC_NAME,
    param,
    UPDATE_HISTORY_COST_CENTER,
    UPDATE_HISTORY_COST_CENTER_ERROR
  );
};

export const deleteHistoryCostCenter = (param) => {
  return history.deleteHistory(
    FUNC_NAME,
    param,
    DELETE_HISTORY_COST_CENTER,
    DELETE_HISTORY_COST_CENTER_ERROR
  );
};
