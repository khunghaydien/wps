import * as base from './base';

const FUNC_NAME = 'att/leave-of-absence';
export const GET_CONSTANTS_LEAVE_OF_ABSENCE = 'GET_CONSTANTS_LEAVE_OF_ABSENCE';
export const SEARCH_LEAVE_OF_ABSENCE = 'SEARCH_LEAVE_OF_ABSENCE';
export const CREATE_LEAVE_OF_ABSENCE = 'CREATE_LEAVE_OF_ABSENCE';
export const DELETE_LEAVE_OF_ABSENCE = 'DELETE_LEAVE_OF_ABSENCE';
export const UPDATE_LEAVE_OF_ABSENCE = 'UPDATE_LEAVE_OF_ABSENCE';
export const SEARCH_LEAVE_OF_ABSENCE_ERROR = 'SEARCH_LEAVE_OF_ABSENCE_ERROR';
export const CREATE_LEAVE_OF_ABSENCE_ERROR = 'CREATE_LEAVE_OF_ABSENCE_ERROR';
export const DELETE_LEAVE_OF_ABSENCE_ERROR = 'DELETE_LEAVE_OF_ABSENCE_ERROR';
export const UPDATE_LEAVE_OF_ABSENCE_ERROR = 'UPDATE_LEAVE_OF_ABSENCE_ERROR';

export const searchLeaveOfAbsence = (param = {}) => {
  return base.search(
    FUNC_NAME,
    param,
    SEARCH_LEAVE_OF_ABSENCE,
    SEARCH_LEAVE_OF_ABSENCE_ERROR
  );
};

export const createLeaveOfAbsence = (param) => {
  return base.create(
    FUNC_NAME,
    param,
    CREATE_LEAVE_OF_ABSENCE,
    CREATE_LEAVE_OF_ABSENCE_ERROR
  );
};

export const deleteLeaveOfAbsence = (param) => {
  return base.del(
    FUNC_NAME,
    param,
    DELETE_LEAVE_OF_ABSENCE,
    DELETE_LEAVE_OF_ABSENCE_ERROR
  );
};

export const updateLeaveOfAbsence = (param) => {
  return base.update(
    FUNC_NAME,
    param,
    UPDATE_LEAVE_OF_ABSENCE,
    UPDATE_LEAVE_OF_ABSENCE_ERROR
  );
};

export const getConstantsLeaveOfAbsence = () => ({
  type: GET_CONSTANTS_LEAVE_OF_ABSENCE,
});
