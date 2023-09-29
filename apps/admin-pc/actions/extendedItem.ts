import * as base from './base';

const FUNC_NAME = 'extended-item';
export const SEARCH_EXTENDED_ITEM = 'SEARCH_EXTENDED_ITEM';
export const CREATE_EXTENDED_ITEM = 'CREATE_EXTENDED_ITEM';
export const DELETE_EXTENDED_ITEM = 'DELETE_EXTENDED_ITEM';
export const UPDATE_EXTENDED_ITEM = 'UPDATE_EXTENDED_ITEM';
export const SEARCH_EXTENDED_ITEM_ERROR = 'SEARCH_EXTENDED_ITEM_ERROR';
export const CREATE_EXTENDED_ITEM_ERROR = 'CREATE_EXTENDED_ITEM_ERROR';
export const DELETE_EXTENDED_ITEM_ERROR = 'DELETE_EXTENDED_ITEM_ERROR';
export const UPDATE_EXTENDED_ITEM_ERROR = 'UPDATE_EXTENDED_ITEM_ERROR';
export const GET_CONSTANTS_EXTENDED_ITEM = 'GET_CONSTANTS_EXTENDED_ITEM';

export const searchExtendedItem = (param = {}) => {
  return base.search(
    FUNC_NAME,
    param,
    SEARCH_EXTENDED_ITEM,
    SEARCH_EXTENDED_ITEM_ERROR
  );
};

export const createExtendedItem = (param) => {
  return base.create(
    FUNC_NAME,
    param,
    CREATE_EXTENDED_ITEM,
    CREATE_EXTENDED_ITEM_ERROR
  );
};

export const deleteExtendedItem = (param) => {
  return base.del(
    FUNC_NAME,
    param,
    DELETE_EXTENDED_ITEM,
    DELETE_EXTENDED_ITEM_ERROR
  );
};

export const updateExtendedItem = (param) => {
  return base.update(
    FUNC_NAME,
    param,
    UPDATE_EXTENDED_ITEM,
    UPDATE_EXTENDED_ITEM_ERROR
  );
};

export const getConstantsExtendedItem = () => ({
  type: GET_CONSTANTS_EXTENDED_ITEM,
});
