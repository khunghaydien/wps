import * as base from './base';
import * as history from './history';

const FUNC_NAME = 'att/working-type';
export const SEARCH_WORKING_TYPE = 'SEARCH_WORKING_TYPE';
export const CREATE_WORKING_TYPE = 'CREATE_WORKING_TYPE';
export const DELETE_WORKING_TYPE = 'DELETE_WORKING_TYPE';
export const UPDATE_WORKING_TYPE = 'UPDATE_WORKING_TYPE';
export const CREATE_HISTORY_WORKING_TYPE = 'CREATE_HISTORY_WORKING_TYPE';
export const SEARCH_HISTORY_WORKING_TYPE = 'SEARCH_HISTORY_WORKING_TYPE';
export const UPDATE_HISTORY_WORKING_TYPE = 'UPDATE_HISTORY_WORKING_TYPE';
export const DELETE_HISTORY_WORKING_TYPE = 'DELETE_HISTORY_WORKING_TYPE';
export const SEARCH_WORKING_TYPE_ERROR = 'SEARCH_WORKING_TYPE_ERROR';
export const CREATE_WORKING_TYPE_ERROR = 'CREATE_WORKING_TYPE_ERROR';
export const DELETE_WORKING_TYPE_ERROR = 'DELETE_WORKING_TYPE_ERROR';
export const UPDATE_WORKING_TYPE_ERROR = 'UPDATE_WORKING_TYPE_ERROR';
export const CREATE_HISTORY_WORKING_TYPE_ERROR =
  'CREATE_HISTORY_WORKING_TYPE_ERROR';
export const SEARCH_HISTORY_WORKING_TYPE_ERROR =
  'SEARCH_HISTORY_WORKING_TYPE_ERROR';
export const UPDATE_HISTORY_WORKING_TYPE_ERROR =
  'UPDATE_HISTORY_WORKING_TYPE_ERROR';
export const DELETE_HISTORY_WORKING_TYPE_ERROR =
  'DELETE_HISTORY_WORKING_TYPE_ERROR';
export const GET_CONSTANTS_WORKING_TYPE = 'GET_CONSTANTS_WORKING_TYPE';

export const searchWorkingType = (param: any = {}) => {
  return base.search(
    FUNC_NAME,
    {
      ...param,
      targetDate: param.targetDate || undefined,
    },
    SEARCH_WORKING_TYPE,
    SEARCH_WORKING_TYPE_ERROR
  );
};

export const createWorkingType = (param) => {
  return base.create(
    FUNC_NAME,
    param,
    CREATE_WORKING_TYPE,
    CREATE_WORKING_TYPE_ERROR
  );
};

export const deleteWorkingType = (param) => {
  return base.del(
    FUNC_NAME,
    param,
    DELETE_WORKING_TYPE,
    DELETE_WORKING_TYPE_ERROR
  );
};

export const updateWorkingType = (param) => {
  return base.update(
    FUNC_NAME,
    param,
    UPDATE_WORKING_TYPE,
    UPDATE_WORKING_TYPE_ERROR
  );
};

export const searchHistoryWorkingType = (param = {}) => {
  return history.searchHistory(
    FUNC_NAME,
    param,
    SEARCH_HISTORY_WORKING_TYPE,
    SEARCH_HISTORY_WORKING_TYPE_ERROR
  );
};

export const createHistoryWorkingType = (param) => {
  return history.createHistory(
    FUNC_NAME,
    param,
    CREATE_HISTORY_WORKING_TYPE,
    CREATE_HISTORY_WORKING_TYPE_ERROR
  );
};

export const updateHistoryWorkingType = (param) => {
  return history.updateHistory(
    FUNC_NAME,
    param,
    UPDATE_HISTORY_WORKING_TYPE,
    UPDATE_HISTORY_WORKING_TYPE_ERROR
  );
};

export const deleteHistoryWorkingType = (param) => {
  return history.deleteHistory(
    FUNC_NAME,
    param,
    DELETE_HISTORY_WORKING_TYPE,
    DELETE_HISTORY_WORKING_TYPE_ERROR
  );
};

export const getConstantsWorkingType = () => ({
  type: GET_CONSTANTS_WORKING_TYPE,
});
