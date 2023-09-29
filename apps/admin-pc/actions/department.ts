import * as base from './base';
import * as history from './history';

const FUNC_NAME = 'department';
export const SEARCH_DEPARTMENT = 'SEARCH_DEPARTMENT';
export const SEARCH_PARENT_DEPARTMENT = 'SEARCH_PARENT_DEPARTMENT';
export const CREATE_DEPARTMENT = 'CREATE_DEPARTMENT';
export const DELETE_DEPARTMENT = 'DELETE_DEPARTMENT';
export const UPDATE_DEPARTMENT = 'UPDATE_DEPARTMENT';
export const CREATE_HISTORY_DEPARTMENT = 'CREATE_HISTORY_DEPARTMENT';
export const SEARCH_HISTORY_DEPARTMENT = 'SEARCH_HISTORY_DEPARTMENT';
export const UPDATE_HISTORY_DEPARTMENT = 'UPDATE_HISTORY_DEPARTMENT';
export const DELETE_HISTORY_DEPARTMENT = 'DELETE_HISTORY_DEPARTMENT';
export const SEARCH_DEPARTMENT_ERROR = 'SEARCH_DEPARTMENT_ERROR';
export const SEARCH_PARENT_DEPARTMENT_ERROR = 'SEARCH_PARENT_DEPARTMENT_ERROR';
export const CREATE_DEPARTMENT_ERROR = 'CREATE_DEPARTMENT_ERROR';
export const DELETE_DEPARTMENT_ERROR = 'DELETE_DEPARTMENT_ERROR';
export const UPDATE_DEPARTMENT_ERROR = 'UPDATE_DEPARTMENT_ERROR';
export const CREATE_HISTORY_DEPARTMENT_ERROR =
  'CREATE_HISTORY_DEPARTMENT_ERROR';
export const SEARCH_HISTORY_DEPARTMENT_ERROR =
  'SEARCH_HISTORY_DEPARTMENT_ERROR';
export const UPDATE_HISTORY_DEPARTMENT_ERROR =
  'UPDATE_HISTORY_DEPARTMENT_ERROR';
export const DELETE_HISTORY_DEPARTMENT_ERROR =
  'DELETE_HISTORY_DEPARTMENT_ERROR';

export const searchDepartment = (param = {}) => {
  return base.search(
    FUNC_NAME,
    param,
    SEARCH_DEPARTMENT,
    SEARCH_DEPARTMENT_ERROR
  );
};

export const searchParentDepartment = (param = {}) => {
  return base.search(
    FUNC_NAME,
    param,
    SEARCH_PARENT_DEPARTMENT,
    SEARCH_PARENT_DEPARTMENT_ERROR
  );
};

export const createDepartment = (param) => {
  return base.create(
    FUNC_NAME,
    param,
    CREATE_DEPARTMENT,
    CREATE_DEPARTMENT_ERROR
  );
};

export const deleteDepartment = (param) => {
  return base.del(FUNC_NAME, param, DELETE_DEPARTMENT, DELETE_DEPARTMENT_ERROR);
};

export const updateDepartment = (param) => {
  return base.update(
    FUNC_NAME,
    param,
    UPDATE_DEPARTMENT,
    UPDATE_DEPARTMENT_ERROR
  );
};

export const searchHistoryDepartment = (param = {}) => {
  return history.searchHistory(
    FUNC_NAME,
    param,
    SEARCH_HISTORY_DEPARTMENT,
    SEARCH_HISTORY_DEPARTMENT_ERROR
  );
};

export const createHistoryDepartment = (param) => {
  return history.createHistory(
    FUNC_NAME,
    param,
    CREATE_HISTORY_DEPARTMENT,
    CREATE_HISTORY_DEPARTMENT_ERROR
  );
};

export const updateHistoryDepartment = (param) => {
  return history.updateHistory(
    FUNC_NAME,
    param,
    UPDATE_HISTORY_DEPARTMENT,
    UPDATE_HISTORY_DEPARTMENT_ERROR
  );
};

export const deleteHistoryDepartment = (param) => {
  return history.deleteHistory(
    FUNC_NAME,
    param,
    DELETE_HISTORY_DEPARTMENT,
    DELETE_HISTORY_DEPARTMENT_ERROR
  );
};
