import * as base from './base';

const FUNC_NAME = 'company';
export const SEARCH_EXP_SETTING = 'SEARCH_EXP_SETTING';
export const UPDATE_EXP_SETTING = 'UPDATE_EXP_SETTING';
export const GET_CONSTANTS_EXP_SETTING = 'GET_CONSTANTS_EXP_SETTING';
export const SEARCH_EXP_SETTING_ERROR = 'SEARCH_EXP_SETTING_ERROR';
export const UPDATE_EXP_SETTING_ERROR = 'UPDATE_EXP_SETTING_ERROR';

export const searchExpSetting = (param = {}) => {
  return base.search(
    FUNC_NAME,
    param,
    SEARCH_EXP_SETTING,
    SEARCH_EXP_SETTING_ERROR
  );
};

export const updateExpSetting = (param) => {
  return base.update(
    FUNC_NAME,
    param,
    UPDATE_EXP_SETTING,
    UPDATE_EXP_SETTING_ERROR
  );
};

export const getConstantsExpSetting = () => ({
  type: GET_CONSTANTS_EXP_SETTING,
});
