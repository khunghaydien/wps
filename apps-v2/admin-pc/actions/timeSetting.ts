import * as base from './base';
import * as history from './history';

const FUNC_NAME = 'time-setting';
export const GET_CONSTANTS_TIME_SETTING = 'GET_CONSTANTS_TIME_SETTING';
export const SEARCH_TIME_SETTING = 'SEARCH_TIME_SETTING';
export const CREATE_TIME_SETTING = 'CREATE_TIME_SETTING';
export const DELETE_TIME_SETTING = 'DELETE_TIME_SETTING';
export const UPDATE_TIME_SETTING = 'UPDATE_TIME_SETTING';
export const CREATE_HISTORY_TIME_SETTING = 'CREATE_HISTORY_TIME_SETTING';
export const SEARCH_HISTORY_TIME_SETTING = 'SEARCH_HISTORY_TIME_SETTING';
export const UPDATE_HISTORY_TIME_SETTING = 'UPDATE_HISTORY_TIME_SETTING';
export const DELETE_HISTORY_TIME_SETTING = 'DELETE_HISTORY_TIME_SETTING';
export const SEARCH_TIME_SETTING_ERROR = 'SEARCH_TIME_SETTING_ERROR';
export const CREATE_TIME_SETTING_ERROR = 'CREATE_TIME_SETTING_ERROR';
export const DELETE_TIME_SETTING_ERROR = 'DELETE_TIME_SETTING_ERROR';
export const UPDATE_TIME_SETTING_ERROR = 'UPDATE_TIME_SETTING_ERROR';
export const CREATE_HISTORY_TIME_SETTING_ERROR =
  'CREATE_HISTORY_TIME_SETTING_ERROR';
export const SEARCH_HISTORY_TIME_SETTING_ERROR =
  'SEARCH_HISTORY_TIME_SETTING_ERROR';
export const UPDATE_HISTORY_TIME_SETTING_ERROR =
  'UPDATE_HISTORY_TIME_SETTING_ERROR';
export const DELETE_HISTORY_TIME_SETTING_ERROR =
  'DELETE_HISTORY_TIME_SETTING_ERROR';

export const searchTimeSetting = (param = {}) => {
  return base.search(
    FUNC_NAME,
    param,
    SEARCH_TIME_SETTING,
    SEARCH_TIME_SETTING_ERROR
  );
};

export const createTimeSetting = (param) => {
  return base.create(
    FUNC_NAME,
    param,
    CREATE_TIME_SETTING,
    CREATE_TIME_SETTING_ERROR
  );
};

export const deleteTimeSetting = (param) => {
  return base.del(
    FUNC_NAME,
    param,
    DELETE_TIME_SETTING,
    DELETE_TIME_SETTING_ERROR
  );
};

export const updateTimeSetting = (param) => {
  return base.update(
    FUNC_NAME,
    param,
    UPDATE_TIME_SETTING,
    UPDATE_TIME_SETTING_ERROR
  );
};

export const searchHistoryTimeSetting = (param = {}) => {
  return history.searchHistory(
    FUNC_NAME,
    param,
    SEARCH_HISTORY_TIME_SETTING,
    SEARCH_HISTORY_TIME_SETTING_ERROR
  );
};

export const createHistoryTimeSetting = (param) => {
  return history.createHistory(
    FUNC_NAME,
    param,
    CREATE_HISTORY_TIME_SETTING,
    CREATE_HISTORY_TIME_SETTING_ERROR
  );
};

export const updateHistoryTimeSetting = (param) => {
  return history.updateHistory(
    FUNC_NAME,
    param,
    UPDATE_HISTORY_TIME_SETTING,
    UPDATE_HISTORY_TIME_SETTING_ERROR
  );
};

export const deleteHistoryTimeSetting = (param) => {
  return history.deleteHistory(
    FUNC_NAME,
    param,
    DELETE_HISTORY_TIME_SETTING,
    DELETE_HISTORY_TIME_SETTING_ERROR
  );
};

export const getConstantsTimeSetting = () => {
  return { type: GET_CONSTANTS_TIME_SETTING };
};
