import * as base from './base';

const FUNC_NAME = 'att/record-extended-item-set';
export const SEARCH_RECORD_EXTENDED_ITEM_SET =
  'SEARCH_RECORD_EXTENDED_ITEM_SET';
export const CREATE_RECORD_EXTENDED_ITEM_SET =
  'CREATE_RECORD_EXTENDED_ITEM_SET';
export const DELETE_RECORD_EXTENDED_ITEM_SET =
  'DELETE_RECORD_EXTENDED_ITEM_SET';
export const UPDATE_RECORD_EXTENDED_ITEM_SET =
  'UPDATE_RECORD_EXTENDED_ITEM_SET';
export const SEARCH_RECORD_EXTENDED_ITEM_SET_ERROR =
  'SEARCH_RECORD_EXTENDED_ITEM_SET_ERROR';
export const CREATE_RECORD_EXTENDED_ITEM_SET_ERROR =
  'CREATE_RECORD_EXTENDED_ITEM_SET_ERROR';
export const DELETE_RECORD_EXTENDED_ITEM_SET_ERROR =
  'DELETE_RECORD_EXTENDED_ITEM_SET_ERROR';
export const UPDATE_RECORD_EXTENDED_ITEM_SET_ERROR =
  'UPDATE_RECORD_EXTENDED_ITEM_SET_ERROR';
export const GET_CONSTANTS_RECORD_EXTENDED_ITEM_SET =
  'GET_CONSTANTS_RECORD_EXTENDED_ITEM_SET';

export const searchRecordExtendedItemSet = (param = {}) => {
  return base.search(
    FUNC_NAME,
    param,
    SEARCH_RECORD_EXTENDED_ITEM_SET,
    SEARCH_RECORD_EXTENDED_ITEM_SET_ERROR
  );
};

export const createRecordExtendedItemSet = (param) => {
  return base.create(
    FUNC_NAME,
    param,
    CREATE_RECORD_EXTENDED_ITEM_SET,
    CREATE_RECORD_EXTENDED_ITEM_SET_ERROR
  );
};

export const deleteRecordExtendedItemSet = (param) => {
  return base.del(
    FUNC_NAME,
    param,
    DELETE_RECORD_EXTENDED_ITEM_SET,
    DELETE_RECORD_EXTENDED_ITEM_SET_ERROR
  );
};

export const updateRecordExtendedItemSet = (param) => {
  return base.update(
    FUNC_NAME,
    param,
    UPDATE_RECORD_EXTENDED_ITEM_SET,
    GET_CONSTANTS_RECORD_EXTENDED_ITEM_SET
  );
};

export const getConstantsRecordExtendedItemSet = () => ({
  type: GET_CONSTANTS_RECORD_EXTENDED_ITEM_SET,
});
