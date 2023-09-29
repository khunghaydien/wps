import * as base from './base';
import * as history from './history';

const FUNC_NAME = 'employee';

export const SEARCH_EMPLOYEE = 'SEARCH_EMPLOYEE';
export const SEARCH_EMPLOYEE_MINIMAL = 'SEARCH_EMPLOYEE_MINIMAL';
export const CREATE_EMPLOYEE = 'CREATE_EMPLOYEE';
export const DELETE_EMPLOYEE = 'DELETE_EMPLOYEE';
export const UPDATE_EMPLOYEE = 'UPDATE_EMPLOYEE';
export const CREATE_HISTORY_EMPLOYEE = 'CREATE_HISTORY_EMPLOYEE';
export const SEARCH_HISTORY_EMPLOYEE = 'SEARCH_HISTORY_EMPLOYEE';
export const UPDATE_HISTORY_EMPLOYEE = 'UPDATE_HISTORY_EMPLOYEE';
export const DELETE_HISTORY_EMPLOYEE = 'DELETE_HISTORY_EMPLOYEE';
export const SEARCH_EMPLOYEE_ERROR = 'SEARCH_EMPLOYEE_ERROR';
export const SEARCH_EMPLOYEE_MINIMAL_ERROR = 'SEARCH_EMPLOYEE_MINIMAL_ERROR';
export const CREATE_EMPLOYEE_ERROR = 'CREATE_EMPLOYEE_ERROR';
export const DELETE_EMPLOYEE_ERROR = 'DELETE_EMPLOYEE_ERROR';
export const UPDATE_EMPLOYEE_ERROR = 'UPDATE_EMPLOYEE_ERROR';
export const CREATE_HISTORY_EMPLOYEE_ERROR = 'CREATE_HISTORY_EMPLOYEE_ERROR';
export const SEARCH_HISTORY_EMPLOYEE_ERROR = 'SEARCH_HISTORY_EMPLOYEE_ERROR';
export const UPDATE_HISTORY_EMPLOYEE_ERROR = 'UPDATE_HISTORY_EMPLOYEE_ERROR';
export const DELETE_HISTORY_EMPLOYEE_ERROR = 'DELETE_HISTORY_EMPLOYEE_ERROR';

export const searchEmployee = (param = {}) => {
  return base.search(FUNC_NAME, param, SEARCH_EMPLOYEE, SEARCH_EMPLOYEE_ERROR);
};

export const searchEmployeeMinimal = (param = {}) => {
  return base.listMinimal(
    FUNC_NAME,
    param,
    SEARCH_EMPLOYEE_MINIMAL,
    SEARCH_EMPLOYEE_MINIMAL_ERROR
  );
};

export const createEmployee = (param) => {
  return base.create(FUNC_NAME, param, CREATE_EMPLOYEE, CREATE_EMPLOYEE_ERROR);
};

export const deleteEmployee = (param) => {
  return base.del(FUNC_NAME, param, DELETE_EMPLOYEE, DELETE_EMPLOYEE_ERROR);
};

export const updateEmployee = (param) => {
  return base.update(FUNC_NAME, param, UPDATE_EMPLOYEE, UPDATE_EMPLOYEE_ERROR);
};

export const searchHistoryEmployee = (param = {}) => {
  return history.searchHistory(
    FUNC_NAME,
    param,
    SEARCH_HISTORY_EMPLOYEE,
    SEARCH_HISTORY_EMPLOYEE_ERROR
  );
};

export const createHistoryEmployee = (param) => {
  return history.createHistory(
    FUNC_NAME,
    param,
    CREATE_HISTORY_EMPLOYEE,
    CREATE_HISTORY_EMPLOYEE_ERROR
  );
};

export const updateHistoryEmployee = (param) => {
  return history.updateHistory(
    FUNC_NAME,
    param,
    UPDATE_HISTORY_EMPLOYEE,
    UPDATE_HISTORY_EMPLOYEE_ERROR
  );
};

export const deleteHistoryEmployee = (param) => {
  return history.deleteHistory(
    FUNC_NAME,
    param,
    DELETE_HISTORY_EMPLOYEE,
    DELETE_HISTORY_EMPLOYEE_ERROR
  );
};
