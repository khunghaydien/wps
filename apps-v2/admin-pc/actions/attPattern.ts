import * as base from './base';

const FUNC_NAME = 'att/pattern';
export const SEARCH_ATT_PATTERN = 'SEARCH_ATT_PATTERN';
export const CREATE_ATT_PATTERN = 'CREATE_ATT_PATTERN';
export const DELETE_ATT_PATTERN = 'DELETE_ATT_PATTERN';
export const UPDATE_ATT_PATTERN = 'UPDATE_ATT_PATTERN';
export const SEARCH_ATT_PATTERN_ERROR = 'SEARCH_ATT_PATTERN_ERROR';
export const CREATE_ATT_PATTERN_ERROR = 'CREATE_ATT_PATTERN_ERROR';
export const DELETE_ATT_PATTERN_ERROR = 'DELETE_ATT_PATTERN_ERROR';
export const UPDATE_ATT_PATTERN_ERROR = 'UPDATE_ATT_PATTERN_ERROR';
export const CREATE_HISTORY_ATT_PATTERN_ERROR =
  'CREATE_HISTORY_ATT_PATTERN_ERROR';
export const SEARCH_HISTORY_ATT_PATTERN_ERROR =
  'SEARCH_HISTORY_ATT_PATTERN_ERROR';
export const UPDATE_HISTORY_ATT_PATTERN_ERROR =
  'UPDATE_HISTORY_ATT_PATTERN_ERROR';
export const DELETE_HISTORY_ATT_PATTERN_ERROR =
  'DELETE_HISTORY_ATT_PATTERN_ERROR';
export const GET_CONSTANTS_ATT_PATTERN = 'GET_CONSTANTS_ATT_PATTERN';

export const searchAttPattern = (param: Record<string, any> = {}) => {
  return base.search(
    FUNC_NAME,
    param,
    SEARCH_ATT_PATTERN,
    SEARCH_ATT_PATTERN_ERROR
  );
};

export const createAttPattern = (param: Record<string, any>) => {
  return base.create(
    FUNC_NAME,
    param,
    CREATE_ATT_PATTERN,
    CREATE_ATT_PATTERN_ERROR
  );
};

export const deleteAttPattern = (param: Record<string, any>) => {
  return base.del(
    FUNC_NAME,
    param,
    DELETE_ATT_PATTERN,
    DELETE_ATT_PATTERN_ERROR
  );
};

export const updateAttPattern = (param: Record<string, any>) => {
  return base.update(
    FUNC_NAME,
    param,
    UPDATE_ATT_PATTERN,
    UPDATE_ATT_PATTERN_ERROR
  );
};

export const getConstantsAttPattern = () => ({
  type: GET_CONSTANTS_ATT_PATTERN,
});
