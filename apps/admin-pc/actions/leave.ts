import * as base from './base';

const FUNC_NAME = 'att/leave';
export const SEARCH_LEAVE = 'SEARCH_LEAVE';
export const CREATE_LEAVE = 'CREATE_LEAVE';
export const DELETE_LEAVE = 'DELETE_LEAVE';
export const UPDATE_LEAVE = 'UPDATE_LEAVE';
export const SEARCH_LEAVE_ERROR = 'SEARCH_LEAVE_ERROR';
export const CREATE_LEAVE_ERROR = 'CREATE_LEAVE_ERROR';
export const DELETE_LEAVE_ERROR = 'DELETE_LEAVE_ERROR';
export const UPDATE_LEAVE_ERROR = 'UPDATE_LEAVE_ERROR';
export const GET_CONSTANTS_LEAVE = 'GET_CONSTANTS_LEAVE';

export const searchLeave = (param = {}) => {
  return base.search(FUNC_NAME, param, SEARCH_LEAVE, SEARCH_LEAVE_ERROR);
};

export const createLeave = (param) => {
  return base.create(FUNC_NAME, param, CREATE_LEAVE, CREATE_LEAVE_ERROR);
};

export const deleteLeave = (param) => {
  return base.del(FUNC_NAME, param, DELETE_LEAVE, DELETE_LEAVE_ERROR);
};

export const updateLeave = (param) => {
  return base.update(FUNC_NAME, param, UPDATE_LEAVE, UPDATE_LEAVE_ERROR);
};

export const getConstantsLeave = () => ({
  type: GET_CONSTANTS_LEAVE,
});
