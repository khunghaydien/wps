import {
  catchApiError,
  loadingEnd,
  loadingStart,
} from '../../commons/actions/app';
import Api from '../../commons/api';

import * as base from './base';

const FUNC_NAME = 'psa/skillset-category';
export const LIST_CATEGORY = 'LIST_CATEGORY';
export const SEARCH_CATEGORY = 'SEARCH_CATEGORY';
export const CREATE_CATEGORY = 'CREATE_CATEGORY';
export const DELETE_CATEGORY = 'DELETE_CATEGORY';
export const UPDATE_CATEGORY = 'UPDATE_CATEGORY';
export const LIST_CATEGORY_ERROR = 'LIST_CATEGORY_ERROR';
export const SEARCH_CATEGORY_ERROR = 'SEARCH_CATEGORY_ERROR';
export const CREATE_CATEGORY_ERROR = 'CREATE_CATEGORY_ERROR';
export const DELETE_CATEGORY_ERROR = 'DELETE_CATEGORY_ERROR';
export const UPDATE_CATEGORY_ERROR = 'UPDATE_CATEGORY_ERROR';

const searchSuccess = (type, records) => ({
  type,
  payload: records,
});

const searchError = (type) => ({
  type,
});

const search = (path, param, successType, errorType) => (dispatch) => {
  dispatch(loadingStart());
  const req = { path, param };
  return Api.invoke(req)
    .then((result) => {
      dispatch(searchSuccess(successType, result.categories));
      return result.categories;
    })
    .catch((err) => {
      dispatch(searchError(errorType));
      dispatch(catchApiError(err, { isContinuable: true }));
      throw err;
    })
    .finally(() => dispatch(loadingEnd()));
};

export const searchCategory = (param = {}) => {
  return search(
    `/${FUNC_NAME}/search`,
    param,
    SEARCH_CATEGORY,
    SEARCH_CATEGORY_ERROR
  );
};

export const listCategory = (param) => {
  return search(
    `/${FUNC_NAME}/list`,
    param,
    LIST_CATEGORY,
    LIST_CATEGORY_ERROR
  );
};

export const createCategory = (param) => {
  return base.save(FUNC_NAME, param, CREATE_CATEGORY, CREATE_CATEGORY_ERROR);
};

export const deleteCategory = (param) => {
  return base.del(FUNC_NAME, param, DELETE_CATEGORY, DELETE_CATEGORY_ERROR);
};

export const updateCategory = (param) => {
  return base.save(FUNC_NAME, param, UPDATE_CATEGORY, UPDATE_CATEGORY_ERROR);
};
