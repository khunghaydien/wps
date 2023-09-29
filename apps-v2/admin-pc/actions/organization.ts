import * as base from './base';

const FUNC_NAME = 'organization-setting';
export const GET_ORGANIZATION_SETTING = 'GET_ORGANIZATION_SETTING';
export const UPDATE_ORGANIZATION_SETTING = 'UPDATE_ORGANIZATION_SETTING';
export const GET_ORGANIZATION_SETTING_ERROR = 'GET_ORGANIZATION_SETTING_ERROR';
export const UPDATE_ORGANIZATION_SETTING_ERROR =
  'UPDATE_ORGANIZATION_SETTING_ERROR';

export const getOrganizationSetting = (param = {}) => {
  return base.get(
    FUNC_NAME,
    param,
    GET_ORGANIZATION_SETTING,
    GET_ORGANIZATION_SETTING_ERROR
  );
};

export const updateOrganizationSetting = (param) => {
  return base.update(
    FUNC_NAME,
    param,
    UPDATE_ORGANIZATION_SETTING,
    UPDATE_ORGANIZATION_SETTING_ERROR
  );
};
