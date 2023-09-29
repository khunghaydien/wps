import * as base from './base';

const FUNC_NAME = 'custom-hint';
export const SEARCH_CUSTOM_HINT = 'SEARCH_CUSTOM_HINT';
export const UPDATE_CUSTOM_HINT = 'UPDATE_CUSTOM_HINT';
export const SEARCH_CUSTOM_HINT_ERROR = 'SEARCH_CUSTOM_HINT_ERROR';
export const UPDATE_CUSTOM_HINT_ERROR = 'UPDATE_CUSTOM_HINT_ERROR';

export const searchCustomHint = (param = {}) => {
  return base.search(
    FUNC_NAME,
    param,
    SEARCH_CUSTOM_HINT,
    SEARCH_CUSTOM_HINT_ERROR
  );
};

export const updateCustomHint = (param) => {
  return base.update(
    FUNC_NAME,
    param,
    UPDATE_CUSTOM_HINT,
    UPDATE_CUSTOM_HINT_ERROR
  );
};
