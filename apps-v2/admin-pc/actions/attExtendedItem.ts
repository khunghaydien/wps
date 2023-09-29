import * as base from './base';

const FUNC_NAME = 'att/extended-item';
export const SEARCH_ATT_EXTENDED_ITEM = 'SEARCH_ATT_EXTENDED_ITEM';
export const CREATE_ATT_EXTENDED_ITEM = 'CREATE_ATT_EXTENDED_ITEM';
export const DELETE_ATT_EXTENDED_ITEM = 'DELETE_ATT_EXTENDED_ITEM';
export const UPDATE_ATT_EXTENDED_ITEM = 'UPDATE_ATT_EXTENDED_ITEM';
export const SEARCH_ATT_EXTENDED_ITEM_ERROR = 'SEARCH_ATT_EXTENDED_ITEM_ERROR';
export const CREATE_ATT_EXTENDED_ITEM_ERROR = 'CREATE_ATT_EXTENDED_ITEM_ERROR';
export const DELETE_ATT_EXTENDED_ITEM_ERROR = 'DELETE_ATT_EXTENDED_ITEM_ERROR';
export const UPDATE_ATT_EXTENDED_ITEM_ERROR = 'UPDATE_ATT_EXTENDED_ITEM_ERROR';
export const GET_CONSTANTS_ATT_EXTENDED_ITEM =
  'GET_CONSTANTS_ATT_EXTENDED_ITEM';

export const searchAttExtendedItem = (param = {}) => {
  return base.search(
    FUNC_NAME,
    param,
    SEARCH_ATT_EXTENDED_ITEM,
    SEARCH_ATT_EXTENDED_ITEM_ERROR
  );
};

export const createAttExtendedItem = (param) => {
  return base.create(
    FUNC_NAME,
    param,
    CREATE_ATT_EXTENDED_ITEM,
    CREATE_ATT_EXTENDED_ITEM_ERROR
  );
};

export const deleteAttExtendedItem = (param) => {
  return base.del(
    FUNC_NAME,
    param,
    DELETE_ATT_EXTENDED_ITEM,
    DELETE_ATT_EXTENDED_ITEM_ERROR
  );
};

export const updateAttExtendedItem = (param) => {
  return base.update(
    FUNC_NAME,
    param,
    UPDATE_ATT_EXTENDED_ITEM,
    UPDATE_ATT_EXTENDED_ITEM_ERROR
  );
};

export const getConstantsAttExtendedItem = () => ({
  type: GET_CONSTANTS_ATT_EXTENDED_ITEM,
});
