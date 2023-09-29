import * as base from '@admin-pc/actions/base';

const FUNC_NAME = 'position';
export const SEARCH_POSITION = 'SEARCH_POSITION';
export const CREATE_POSITION = 'CREATE_POSITION';
export const DELETE_POSITION = 'DELETE_POSITION';
export const UPDATE_POSITION = 'UPDATE_POSITION';
export const SEARCH_POSITION_ERROR = 'SEARCH_POSITION_ERROR';
export const CREATE_POSITION_ERROR = 'CREATE_POSITION_ERROR';
export const DELETE_POSITION_ERROR = 'DELETE_POSITION_ERROR';
export const UPDATE_POSITION_ERROR = 'UPDATE_POSITION_ERROR';

export const searchPosition = (param = {}) => {
  return base.search(FUNC_NAME, param, SEARCH_POSITION, SEARCH_POSITION_ERROR);
};

export const createPosition = (param) => {
  return base.create(FUNC_NAME, param, CREATE_POSITION, CREATE_POSITION_ERROR);
};

export const deletePosition = (param) => {
  return base.del(FUNC_NAME, param, DELETE_POSITION, DELETE_POSITION_ERROR);
};

export const updatePosition = (param) => {
  return base.update(FUNC_NAME, param, UPDATE_POSITION, UPDATE_POSITION_ERROR);
};
