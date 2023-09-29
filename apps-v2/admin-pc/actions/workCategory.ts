import * as base from './base';

const FUNC_NAME = 'work-category';
export const SEARCH_WORK_CATEGORY = 'SEARCH_WORK_CATEGORY';
export const CREATE_WORK_CATEGORY = 'CREATE_WORK_CATEGORY';
export const DELETE_WORK_CATEGORY = 'DELETE_WORK_CATEGORY';
export const UPDATE_WORK_CATEGORY = 'UPDATE_WORK_CATEGORY';
export const SEARCH_WORK_CATEGORY_ERROR = 'SEARCH_WORK_CATEGORY_ERROR';
export const CREATE_WORK_CATEGORY_ERROR = 'CREATE_WORK_CATEGORY_ERROR';
export const DELETE_WORK_CATEGORY_ERROR = 'DELETE_WORK_CATEGORY_ERROR';
export const UPDATE_WORK_CATEGORY_ERROR = 'UPDATE_WORK_CATEGORY_ERROR';

export const searchWorkCategory = (param = {}) => {
  return base.search(
    FUNC_NAME,
    param,
    SEARCH_WORK_CATEGORY,
    SEARCH_WORK_CATEGORY_ERROR
  );
};

export const searchSortedWorkCategory = (param = {}) => {
  return searchWorkCategory({
    ...param,
    sortBy: { field: 'order', order: 'asc' },
  });
};

export const createWorkCategory = (param) => {
  return base.create(
    FUNC_NAME,
    param,
    CREATE_WORK_CATEGORY,
    CREATE_WORK_CATEGORY_ERROR
  );
};

export const deleteWorkCategory = (param) => {
  return base.del(
    FUNC_NAME,
    param,
    DELETE_WORK_CATEGORY,
    DELETE_WORK_CATEGORY_ERROR
  );
};

export const updateWorkCategory = (param) => {
  return base.update(
    FUNC_NAME,
    param,
    UPDATE_WORK_CATEGORY,
    UPDATE_WORK_CATEGORY_ERROR
  );
};
