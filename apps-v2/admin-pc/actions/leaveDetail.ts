import * as base from './base';

const FUNC_NAME = 'att/leave-detail';
export const SEARCH_LEAVE_DETAIL = 'SEARCH_LEAVE_DETAIL';
export const CREATE_LEAVE_DETAIL = 'CREATE_LEAVE_DETAIL';
export const DELETE_LEAVE_DETAIL = 'DELETE_LEAVE_DETAIL';
export const UPDATE_LEAVE_DETAIL = 'UPDATE_LEAVE_DETAIL';
export const SEARCH_LEAVE_DETAIL_ERROR = 'SEARCH_LEAVE_DETAIL_ERROR';
export const CREATE_LEAVE_DETAIL_ERROR = 'CREATE_LEAVE_DETAIL_ERROR';
export const DELETE_LEAVE_DETAIL_ERROR = 'DELETE_LEAVE_DETAIL_ERROR';
export const UPDATE_LEAVE_DETAIL_ERROR = 'UPDATE_LEAVE_DETAIL_ERROR';
export const GET_CONSTANTS_LEAVE_DETAIL = 'GET_CONSTANTS_LEAVE_DETAIL';

export const searchLeaveDetail = (param = {}) => {
  return base.search(
    FUNC_NAME,
    param,
    SEARCH_LEAVE_DETAIL,
    SEARCH_LEAVE_DETAIL_ERROR
  );
};

export const createLeaveDetail = (param) => {
  return base.create(
    FUNC_NAME,
    param,
    CREATE_LEAVE_DETAIL,
    CREATE_LEAVE_DETAIL_ERROR
  );
};

export const deleteLeaveDetail = (param) => {
  return base.del(
    FUNC_NAME,
    param,
    DELETE_LEAVE_DETAIL,
    DELETE_LEAVE_DETAIL_ERROR
  );
};

export const updateLeaveDetail = (param) => {
  return base.update(
    FUNC_NAME,
    param,
    UPDATE_LEAVE_DETAIL,
    UPDATE_LEAVE_DETAIL_ERROR
  );
};

export const getConstantsLeaveDetail = () => ({
  type: GET_CONSTANTS_LEAVE_DETAIL,
});
