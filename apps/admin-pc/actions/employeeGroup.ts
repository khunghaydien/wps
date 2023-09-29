import * as base from './base';

const FUNC_NAME = 'exp/expense-employee-group';
export const SEARCH_EMPLOYEE_GROUP = 'SEARCH_EMPLOYEE_EMPLOYEE_GROUP';
export const CREATE_EMPLOYEE_GROUP = 'CREATE_EMPLOYEE_GROUP';
export const DELETE_EMPLOYEE_GROUP = 'DELETE_EMPLOYEE_GROUP';
export const UPDATE_EMPLOYEE_GROUP = 'UPDATE_EMPLOYEE_GROUP';
export const SEARCH_EMPLOYEE_GROUP_ERROR =
  'SEARCH_EMPLOYEE_EMPLOYEE_GROUP_ERROR';
export const CREATE_EMPLOYEE_GROUP_ERROR = 'CREATE_EMPLOYEE_GROUP_ERROR';
export const DELETE_EMPLOYEE_GROUP_ERROR = 'DELETE_EMPLOYEE_GROUP_ERROR';
export const UPDATE_EMPLOYEE_GROUP_ERROR = 'UPDATE_EMPLOYEE_GROUP_ERROR';

export const searchEmployeeGroup = (param = {}) => {
  return base.search(
    FUNC_NAME,
    param,
    SEARCH_EMPLOYEE_GROUP,
    SEARCH_EMPLOYEE_GROUP_ERROR
  );
};

export const createEmployeeGroup = (param) => {
  return base.create(
    FUNC_NAME,
    param,
    CREATE_EMPLOYEE_GROUP,
    CREATE_EMPLOYEE_GROUP_ERROR
  );
};

export const deleteEmployeeGroup = (param) => {
  return base.del(
    FUNC_NAME,
    param,
    DELETE_EMPLOYEE_GROUP,
    DELETE_EMPLOYEE_GROUP_ERROR
  );
};

export const updateEmployeeGroup = (param) => {
  return base.update(
    FUNC_NAME,
    param,
    UPDATE_EMPLOYEE_GROUP,
    UPDATE_EMPLOYEE_GROUP_ERROR
  );
};
