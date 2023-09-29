import cloneDeep from 'lodash/cloneDeep';

import * as base from './base';

const FUNC_NAME = 'psa/extended-item';
export const SEARCH_EXTENDED_ITEM_PSA = 'SEARCH_EXTENDED_ITEM_PSA';
export const CREATE_EXTENDED_ITEM_PSA = 'CREATE_EXTENDED_ITEM_PSA';
export const DELETE_EXTENDED_ITEM_PSA = 'DELETE_EXTENDED_ITEM_PSA';
export const UPDATE_EXTENDED_ITEM_PSA = 'UPDATE_EXTENDED_ITEM_PSA';
export const SEARCH_EXTENDED_ITEM_PSA_ERROR = 'SEARCH_EXTENDED_ITEM_PSA_ERROR';
export const CREATE_EXTENDED_ITEM_PSA_ERROR = 'CREATE_EXTENDED_ITEM_PSA_ERROR';
export const DELETE_EXTENDED_ITEM_PSA_ERROR = 'DELETE_EXTENDED_ITEM_PSA_ERROR';
export const UPDATE_EXTENDED_ITEM_PSA_ERROR = 'UPDATE_EXTENDED_ITEM_PSA_ERROR';
export const GET_CONSTANTS_EXTENDED_ITEM_PSA =
  'GET_CONSTANTS_EXTENDED_ITEM_PSA';

export const searchExtendedItem = (param = {}) => {
  return base.search(
    FUNC_NAME,
    param,
    SEARCH_EXTENDED_ITEM_PSA,
    SEARCH_EXTENDED_ITEM_PSA_ERROR
  );
};

export const createExtendedItem = (objectType: string) => (param) => {
  const finalParam = cloneDeep(param);
  finalParam.objectType = objectType;

  return base.save(
    FUNC_NAME,
    finalParam,
    CREATE_EXTENDED_ITEM_PSA,
    CREATE_EXTENDED_ITEM_PSA_ERROR
  );
};

export const deleteExtendedItem = (objectType: string) => (param) => {
  const finalParam = cloneDeep(param);
  finalParam.objectType = objectType;

  return base.del(
    FUNC_NAME,
    finalParam,
    DELETE_EXTENDED_ITEM_PSA,
    DELETE_EXTENDED_ITEM_PSA_ERROR
  );
};

export const updateExtendedItem = (objectType: string) => (param) => {
  const finalParam = cloneDeep(param);
  finalParam.objectType = objectType;

  return base.save(
    FUNC_NAME,
    finalParam,
    UPDATE_EXTENDED_ITEM_PSA,
    UPDATE_EXTENDED_ITEM_PSA_ERROR
  );
};

export const getConstantsExtendedItem = () => ({
  type: GET_CONSTANTS_EXTENDED_ITEM_PSA,
});
