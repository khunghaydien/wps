import * as base from './base';

const FUNC_NAME = 'psa/setting';
export const GET_PSA_SETTING = 'GET_PSA_SETTING';
export const SAVE_PSA_SETTING = 'SAVE_PSA_SETTING';
export const GET_PSA_SETTING_ERROR = 'GET_PSA_SETTING_ERROR';
export const SAVE_PSA_SETTING_ERROR = 'SAVE_PSA_SETTING_ERROR';

export const getPsaSetting = (param) => {
  return base.get(FUNC_NAME, param, GET_PSA_SETTING, GET_PSA_SETTING_ERROR);
};

export const savePsaSetting = (param) => {
  return base.save(FUNC_NAME, param, SAVE_PSA_SETTING, SAVE_PSA_SETTING_ERROR);
};
