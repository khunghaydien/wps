import * as base from './base';
import * as history from './history';

const FUNC_NAME = 'att/feature-setting';
export const SEARCH_ATTENDANCE_FEATURE_SETTING =
  'SEARCH_ATTENDANCE_FEATURE_SETTING';
export const CREATE_ATTENDANCE_FEATURE_SETTING =
  'CREATE_ATTENDANCE_FEATURE_SETTING';
export const UPDATE_ATTENDANCE_FEATURE_SETTING =
  'UPDATE_ATTENDANCE_FEATURE_SETTING';
export const CREATE_HISTORY_ATTENDANCE_FEATURE_SETTING =
  'CREATE_HISTORY_ATTENDANCE_FEATURE_SETTING';
export const SEARCH_HISTORY_ATTENDANCE_FEATURE_SETTING =
  'SEARCH_HISTORY_ATTENDANCE_FEATURE_SETTING';
export const DELETE_HISTORY_ATTENDANCE_FEATURE_SETTING =
  'DELETE_HISTORY_ATTENDANCE_FEATURE_SETTING';
export const SEARCH_ATTENDANCE_FEATURE_SETTING_ERROR =
  'SEARCH_ATTENDANCE_FEATURE_SETTING_ERROR';
export const CREATE_ATTENDANCE_FEATURE_SETTING_ERROR =
  'CREATE_ATTENDANCE_FEATURE_SETTING_ERROR';
export const UPDATE_ATTENDANCE_FEATURE_SETTING_ERROR =
  'UPDATE_ATTENDANCE_FEATURE_SETTING_ERROR';
export const CREATE_HISTORY_ATTENDANCE_FEATURE_SETTING_ERROR =
  'CREATE_HISTORY_ATTENDANCE_FEATURE_SETTING_ERROR';
export const SEARCH_HISTORY_ATTENDANCE_FEATURE_SETTING_ERROR =
  'SEARCH_HISTORY_ATTENDANCE_FEATURE_SETTING_ERROR';
export const DELETE_HISTORY_ATTENDANCE_FEATURE_SETTING_ERROR =
  'DELETE_HISTORY_ATTENDANCE_FEATURE_SETTING_ERROR';
export const GET_CONSTANTS_ATTENDANCE_FEATURE_SETTING =
  'GET_CONSTANTS_ATTENDANCE_FEATURE_SETTING';

export const searchFeatureSetting = (param: any = {}) => {
  return base.search(
    FUNC_NAME,
    {
      ...param,
      targetDate: param.targetDate || undefined,
    },
    SEARCH_ATTENDANCE_FEATURE_SETTING,
    SEARCH_ATTENDANCE_FEATURE_SETTING_ERROR
  );
};

export const createFeatureSetting = (param) => {
  return base.create(
    FUNC_NAME,
    param,
    CREATE_ATTENDANCE_FEATURE_SETTING,
    CREATE_ATTENDANCE_FEATURE_SETTING_ERROR
  );
};

export const updateFeatureSetting = (param) => {
  return base.update(
    FUNC_NAME,
    param,
    UPDATE_ATTENDANCE_FEATURE_SETTING,
    UPDATE_ATTENDANCE_FEATURE_SETTING_ERROR
  );
};

export const searchHistoryFeatureSetting = (param = {}) => {
  return history.searchHistory(
    FUNC_NAME,
    param,
    SEARCH_HISTORY_ATTENDANCE_FEATURE_SETTING,
    SEARCH_HISTORY_ATTENDANCE_FEATURE_SETTING_ERROR
  );
};

export const createHistoryFeatureSetting = (param) => {
  return history.createHistory(
    FUNC_NAME,
    param,
    CREATE_HISTORY_ATTENDANCE_FEATURE_SETTING,
    CREATE_HISTORY_ATTENDANCE_FEATURE_SETTING_ERROR
  );
};

export const deleteHistoryFeatureSetting = (param) => {
  return history.deleteHistory(
    FUNC_NAME,
    param,
    DELETE_HISTORY_ATTENDANCE_FEATURE_SETTING,
    DELETE_HISTORY_ATTENDANCE_FEATURE_SETTING_ERROR
  );
};

export const getConstantsFeatureSetting = () => ({
  type: GET_CONSTANTS_ATTENDANCE_FEATURE_SETTING,
});