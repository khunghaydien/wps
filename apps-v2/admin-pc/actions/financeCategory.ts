import {
  catchApiError,
  loadingEnd,
  loadingStart,
} from '../../commons/actions/app';
import Api from '../../commons/api';

import * as base from './base';

const FUNC_NAME = 'psa/finance-category';
export const SEARCH_FINANCE_CATEGORY = 'SEARCH_FINANCE_CATEGORY';
export const CREATE_FINANCE_CATEGORY = 'CREATE_FINANCE_CATEGORY';
export const DELETE_FINANCE_CATEGORY = 'DELETE_FINANCE_CATEGORY';
export const UPDATE_FINANCE_CATEGORY = 'UPDATE_FINANCE_CATEGORY';
export const SEARCH_FINANCE_CATEGORY_ERROR = 'SEARCH_FINANCE_CATEGORY_ERROR';
export const CREATE_FINANCE_CATEGORY_ERROR = 'CREATE_FINANCE_CATEGORY_ERROR';
export const DELETE_FINANCE_CATEGORY_ERROR = 'DELETE_FINANCE_CATEGORY_ERROR';
export const UPDATE_FINANCE_CATEGORY_ERROR = 'UPDATE_FINANCE_CATEGORY_ERROR';
export const GET_CONSTANTS_FINANCE_TYPE = 'GET_CONSTANTS_FINANCE_TYPE';

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
      dispatch(searchSuccess(successType, result.financeCategories));
      return result.financeCategories;
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
    SEARCH_FINANCE_CATEGORY,
    SEARCH_FINANCE_CATEGORY_ERROR
  );
};

export const createCategory = (param) => {
  return base.save(
    FUNC_NAME,
    param,
    CREATE_FINANCE_CATEGORY,
    CREATE_FINANCE_CATEGORY_ERROR
  );
};

export const deleteCategory = (param) => {
  return base.del(
    FUNC_NAME,
    param,
    DELETE_FINANCE_CATEGORY,
    DELETE_FINANCE_CATEGORY_ERROR
  );
};

export const updateCategory = (param) => {
  return base.save(
    FUNC_NAME,
    param,
    UPDATE_FINANCE_CATEGORY,
    UPDATE_FINANCE_CATEGORY_ERROR
  );
};

export const getConstantsFinanceType = () => ({
  type: GET_CONSTANTS_FINANCE_TYPE,
});
