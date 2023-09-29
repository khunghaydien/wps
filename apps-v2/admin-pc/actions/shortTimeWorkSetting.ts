import * as base from './base';
import * as history from './history';

const FUNC_NAME = 'att/short-time-work-setting';
export const SEARCH_SHORT_TIME_WORK_SETTING = 'SEARCH_SHORT_TIME_WORK_SETTING';
export const CREATE_SHORT_TIME_WORK_SETTING = 'CREATE_SHORT_TIME_WORK_SETTING';
export const DELETE_SHORT_TIME_WORK_SETTING = 'DELETE_SHORT_TIME_WORK_SETTING';
export const UPDATE_SHORT_TIME_WORK_SETTING = 'UPDATE_SHORT_TIME_WORK_SETTING';
export const CREATE_HISTORY_SHORT_TIME_WORK_SETTING =
  'CREATE_HISTORY_SHORT_TIME_WORK_SETTING';
export const SEARCH_HISTORY_SHORT_TIME_WORK_SETTING =
  'SEARCH_HISTORY_SHORT_TIME_WORK_SETTING';
export const UPDATE_HISTORY_SHORT_TIME_WORK_SETTING =
  'UPDATE_HISTORY_SHORT_TIME_WORK_SETTING';
export const DELETE_HISTORY_SHORT_TIME_WORK_SETTING =
  'DELETE_HISTORY_SHORT_TIME_WORK_SETTING';
export const SEARCH_SHORT_TIME_WORK_SETTING_ERROR =
  'SEARCH_SHORT_TIME_WORK_SETTING_ERROR';
export const CREATE_SHORT_TIME_WORK_SETTING_ERROR =
  'CREATE_SHORT_TIME_WORK_SETTING_ERROR';
export const DELETE_SHORT_TIME_WORK_SETTING_ERROR =
  'DELETE_SHORT_TIME_WORK_SETTING_ERROR';
export const UPDATE_SHORT_TIME_WORK_SETTING_ERROR =
  'UPDATE_SHORT_TIME_WORK_SETTING_ERROR';
export const CREATE_HISTORY_SHORT_TIME_WORK_SETTING_ERROR =
  'CREATE_HISTORY_SHORT_TIME_WORK_SETTING_ERROR';
export const SEARCH_HISTORY_SHORT_TIME_WORK_SETTING_ERROR =
  'SEARCH_HISTORY_SHORT_TIME_WORK_SETTING_ERROR';
export const UPDATE_HISTORY_SHORT_TIME_WORK_SETTING_ERROR =
  'UPDATE_HISTORY_SHORT_TIME_WORK_SETTING_ERROR';
export const DELETE_HISTORY_SHORT_TIME_WORK_SETTING_ERROR =
  'DELETE_HISTORY_SHORT_TIME_WORK_SETTING_ERROR';
export const GET_CONSTANTS_SHORT_TIME_WORK_SETTING =
  'GET_CONSTANTS_SHORT_TIME_WORK_SETTING';

export const searchShortTimeWorkSetting = (param = {}) => {
  return base.search(
    FUNC_NAME,
    param,
    SEARCH_SHORT_TIME_WORK_SETTING,
    SEARCH_SHORT_TIME_WORK_SETTING_ERROR
  );
};

export const createShortTimeWorkSetting = (param) => {
  return base.create(
    FUNC_NAME,
    param,
    CREATE_SHORT_TIME_WORK_SETTING,
    CREATE_SHORT_TIME_WORK_SETTING_ERROR
  );
};

export const deleteShortTimeWorkSetting = (param) => {
  return base.del(
    FUNC_NAME,
    param,
    DELETE_SHORT_TIME_WORK_SETTING,
    DELETE_SHORT_TIME_WORK_SETTING_ERROR
  );
};

export const updateShortTimeWorkSetting = (param) => {
  return base.update(
    FUNC_NAME,
    param,
    UPDATE_SHORT_TIME_WORK_SETTING,
    UPDATE_SHORT_TIME_WORK_SETTING_ERROR
  );
};

export const searchHistoryShortTimeWorkSetting = (param = {}) => {
  return history.searchHistory(
    FUNC_NAME,
    param,
    SEARCH_HISTORY_SHORT_TIME_WORK_SETTING,
    SEARCH_HISTORY_SHORT_TIME_WORK_SETTING_ERROR
  );
};

export const createHistoryShortTimeWorkSetting = (param) => {
  return history.createHistory(
    FUNC_NAME,
    param,
    CREATE_HISTORY_SHORT_TIME_WORK_SETTING,
    CREATE_HISTORY_SHORT_TIME_WORK_SETTING_ERROR
  );
};

export const updateHistoryShortTimeWorkSetting = (param) => {
  return history.updateHistory(
    FUNC_NAME,
    param,
    UPDATE_HISTORY_SHORT_TIME_WORK_SETTING,
    UPDATE_HISTORY_SHORT_TIME_WORK_SETTING_ERROR
  );
};

export const deleteHistoryShortTimeWorkSetting = (param) => {
  return history.deleteHistory(
    FUNC_NAME,
    param,
    DELETE_HISTORY_SHORT_TIME_WORK_SETTING,
    DELETE_HISTORY_SHORT_TIME_WORK_SETTING_ERROR
  );
};

export const getConstantsShortTimeWorkSetting = () => ({
  type: GET_CONSTANTS_SHORT_TIME_WORK_SETTING,
});
