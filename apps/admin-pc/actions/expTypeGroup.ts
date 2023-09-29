import * as base from './base';

const FUNC_NAME = 'exp/expense-type-group';
export const SEARCH_EXPTYPEGROUP = 'SEARCH_EXPTYPEGROUP';
export const SEARCH_PARENT_EXPTYPEGROUP = 'SEARCH_PARENT_EXPTYPEGROUP';
export const CREATE_EXPTYPEGROUP = 'CREATE_EXPTYPEGROUP';
export const DELETE_EXPTYPEGROUP = 'DELETE_EXPTYPEGROUP';
export const UPDATE_EXPTYPEGROUP = 'UPDATE_EXPTYPEGROUP';
export const SEARCH_EXPTYPEGROUP_ERROR = 'SEARCH_EXPTYPEGROUP_ERROR';
export const SEARCH_PARENT_EXPTYPEGROUP_ERROR =
  'SEARCH_PARENT_EXPTYPEGROUP_ERROR';
export const CREATE_EXPTYPEGROUP_ERROR = 'CREATE_EXPTYPEGROUP_ERROR';
export const DELETE_EXPTYPEGROUP_ERROR = 'DELETE_EXPTYPEGROUP_ERROR';
export const UPDATE_EXPTYPEGROUP_ERROR = 'UPDATE_EXPTYPEGROUP_ERROR';
export const SET_DEFAULT_LANGUAGE = 'SET_DEFAULT_LANGUAGE';

export const searchExpTypeGroup = (param = {}) => {
  return base.search(
    FUNC_NAME,
    param,
    SEARCH_EXPTYPEGROUP,
    SEARCH_EXPTYPEGROUP_ERROR
  );
};

export const searchParentExpTypeGroup = (param) => {
  return base.search(
    FUNC_NAME,
    {
      hasNoParent: true,
      ...param,
    },
    SEARCH_PARENT_EXPTYPEGROUP,
    SEARCH_PARENT_EXPTYPEGROUP_ERROR
  );
};

export const createExpTypeGroup = (param) => {
  return base.create(
    FUNC_NAME,
    param,
    CREATE_EXPTYPEGROUP,
    CREATE_EXPTYPEGROUP_ERROR
  );
};

export const deleteExpTypeGroup = (param) => {
  return base.del(
    FUNC_NAME,
    param,
    DELETE_EXPTYPEGROUP,
    DELETE_EXPTYPEGROUP_ERROR
  );
};

export const updateExpTypeGroup = (param) => {
  return base.update(
    FUNC_NAME,
    param,
    UPDATE_EXPTYPEGROUP,
    UPDATE_EXPTYPEGROUP_ERROR
  );
};
