import * as base from '@admin-pc/actions/base';

const FUNC_NAME = 'department/manager';
export const SEARCH_DEPARTMENT_MANAGER = 'SEARCH_DEPARTMENT_MANAGER';
export const CREATE_DEPARTMENT_MANAGER = 'CREATE_DEPARTMENT_MANAGER';
export const DELETE_DEPARTMENT_MANAGER = 'DELETE_DEPARTMENT_MANAGER';
export const UPDATE_DEPARTMENT_MANAGER = 'UPDATE_DEPARTMENT_MANAGER';
export const SEARCH_DEPARTMENT_MANAGER_ERROR =
  'SEARCH_DEPARTMENT_MANAGER_ERROR';
export const CREATE_DEPARTMENT_MANAGER_ERROR =
  'CREATE_DEPARTMENT_MANAGER_ERROR';
export const DELETE_DEPARTMENT_MANAGER_ERROR =
  'DELETE_DEPARTMENT_MANAGER_ERROR';
export const UPDATE_DEPARTMENT_MANAGER_ERROR =
  'UPDATE_DEPARTMENT_MANAGER_ERROR';

export const searchDepartmentManager = (param = {}) => {
  return base.search(
    FUNC_NAME,
    param,
    SEARCH_DEPARTMENT_MANAGER,
    SEARCH_DEPARTMENT_MANAGER_ERROR
  );
};

export const createDepartmentManager = (param) => {
  return base.create(
    FUNC_NAME,
    param,
    CREATE_DEPARTMENT_MANAGER,
    CREATE_DEPARTMENT_MANAGER_ERROR
  );
};

export const deleteDepartmentManager = (param) => {
  return base.del(
    FUNC_NAME,
    param,
    DELETE_DEPARTMENT_MANAGER,
    DELETE_DEPARTMENT_MANAGER_ERROR
  );
};

export const updateDepartmentManager = (param) => {
  return base.update(
    FUNC_NAME,
    param,
    UPDATE_DEPARTMENT_MANAGER,
    UPDATE_DEPARTMENT_MANAGER_ERROR
  );
};
