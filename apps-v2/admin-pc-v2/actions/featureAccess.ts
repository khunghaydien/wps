import cloneDeep from 'lodash/cloneDeep';
import get from 'lodash/get';

import * as base from '@admin-pc/actions/base';

export type DetailPermission = {
  id: string;
  name: string;
  isEnabled: boolean;
};

export type FeatureAccess = {
  id: string;
  code: string;
  name: string;
  name_L0: string;
  name_L1: string;
  companyId: string;
  product: string;
  details: DetailPermission[];
};

export const COM_SEARCH_FEATURE_ACCESS = 'COM_SEARCH_FEATURE_ACCESS';
export const ATT_SEARCH_FEATURE_ACCESS = 'ATT_SEARCH_FEATURE_ACCESS';
export const EXP_SEARCH_FEATURE_ACCESS = 'EXP_SEARCH_FEATURE_ACCESS';
export const TIME_SEARCH_FEATURE_ACCESS = 'TIME_SEARCH_FEATURE_ACCESS';
export const PSA_SEARCH_FEATURE_ACCESS = 'PSA_SEARCH_FEATURE_ACCESS';
export const CREATE_FEATURE_ACCESS = 'CREATE_FEATURE_ACCESS';
export const DELETE_FEATURE_ACCESS = 'DELETE_FEATURE_ACCESS';
export const FETCH_FEATURE_ACCESS_RECORD = 'FETCH_FEATURE_ACCESS_RECORD';
export const UPDATE_FEATURE_ACCESS = 'UPDATE_FEATURE_ACCESS';
export const FETCH_FEATURE_ACCESS_LIST = 'FETCH_FEATURE_ACCESS_LIST';
export const CREATE_FEATURE_ACCESS_ERROR = 'CREATE_FEATURE_ACCESS_ERROR';
export const DELETE_FEATURE_ACCESS_ERROR = 'DELETE_FEATURE_ACCESS_ERROR';
export const UPDATE_FEATURE_ACCESS_ERROR = 'UPDATE_FEATURE_ACCESS_ERROR';
export const FETCH_FEATURE_ACCESS_RECORD_ERROR =
  'FETCH_FEATURE_ACCESS_RECORD_ERROR';
export const FETCH_FEATURE_ACCESS_LIST_ERROR =
  'FETCH_FEATURE_ACCESS_LIST_ERROR';

export const searchSuccess = (type, records, product) => ({
  type,
  payload: records.filter((r) => r.product === product),
});

export const searchError = (type) => ({
  type,
});

const FUNC_NAME = 'feature-access';

export const fetchFeatureAccessList = (param = {}) => {
  return base.list(
    FUNC_NAME,
    param,
    FETCH_FEATURE_ACCESS_LIST,
    FETCH_FEATURE_ACCESS_LIST_ERROR
  );
};

export const createFeatureAccess = (config, companyId, tmpValue) => {
  const param = paramConverter(config, companyId, tmpValue);
  return base.create(
    FUNC_NAME,
    param,
    CREATE_FEATURE_ACCESS,
    CREATE_FEATURE_ACCESS_ERROR
  );
};

export const deleteFeatureAccess = (param) => {
  return base.del(
    FUNC_NAME,
    param,
    DELETE_FEATURE_ACCESS,
    DELETE_FEATURE_ACCESS_ERROR
  );
};

export const updateFeatureAccess = (config, companyId, tmpValue, entity) => {
  const param = paramConverter(config, companyId, tmpValue, entity);
  return base.update(
    FUNC_NAME,
    param,
    UPDATE_FEATURE_ACCESS,
    UPDATE_FEATURE_ACCESS_ERROR
  );
};

export const fetchFeatureAccessRecord = (param) => {
  // dispatch(setRecord(param));
  return base.search(
    FUNC_NAME,
    param,
    FETCH_FEATURE_ACCESS_RECORD,
    FETCH_FEATURE_ACCESS_RECORD_ERROR
  );
};

/**
 * convert received feature access record to valid key-valed based object
 * @param {FeatureAccess} res feature access configList
 * @returns {Record<string, string | boolean>} tmpValue key-value based feature access record
 */
export const responseConverter = (res: FeatureAccess) => {
  const result = cloneDeep(res);
  delete result.details;
  res.details.forEach(({ name, isEnabled }) => {
    result[name] = isEnabled;
  });
  return result;
};

/**
 * convert tmp value to valid param
 * @param {Record<string, any>} configList feature access configList
 * @param {string} setCompanyId
 * @param {Record<string, string | boolean>} tmpValue key-value based feature access record
 * @param {FeatureAccess} entity received feature access record, used for detail permission id
 * @returns {FeatureAccess} res
 */
const paramConverter = (
  config: Record<string, any>,
  companyId: string,
  tmpValue: Record<string, string | boolean>,
  entity?: FeatureAccess
): FeatureAccess => {
  const res = {} as FeatureAccess;
  const baseKeys = [];
  config.base.forEach(({ key }) => {
    if (key) {
      baseKeys.push(key);
      res[key] = tmpValue[key];
      // for creation set to null
      if (!entity && key === 'id') {
        res[key] = null;
      }
    }
  });
  const selectedModuleSections = config.base.filter(({ section }) => {
    if (!!section && section.includes(tmpValue.product)) {
      return section;
    }
    return false;
  });
  const sectionsConfig = selectedModuleSections.flatMap((o) => o.configList);
  const details = [];
  if (entity) {
    sectionsConfig.forEach(({ key }) => {
      const permission = entity.details.find((o) => o.name === key);
      const permissionId = get(permission, 'id') || null;
      details.push({
        id: permissionId,
        name: key,
        isEnabled: tmpValue[key] || false,
      });
    });
  } else {
    sectionsConfig.forEach(({ key }) => {
      details.push({ id: null, name: key, isEnabled: tmpValue[key] || false });
    });
  }
  res.details = details;
  res.companyId = companyId;
  return res;
};
