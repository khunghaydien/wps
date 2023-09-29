import * as base from './base';

const FUNC_NAME = 'att/feature-setting/opsRecord/field';
export const SEARCH_FEATURE_SETTING_OPS_RECORD =
  'SEARCH_FEATURE_SETTING_OPS_RECORD';
export const SEARCH_FEATURE_SETTING_OPS_RECORD_ERROR =
  'SEARCH_FEATURE_SETTING_OPS_RECORD_ERROR';

export const searchFeatureSettingOpsRecord = (param = {}) => {
  return base.list(
    FUNC_NAME,
    param,
    SEARCH_FEATURE_SETTING_OPS_RECORD,
    SEARCH_FEATURE_SETTING_OPS_RECORD_ERROR
  );
};
