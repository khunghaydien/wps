import {
  catchApiError,
  loadingEnd,
  loadingStart,
} from '@apps/commons/actions/app';
import Api from '@apps/commons/api';

import * as base from './base';

const FUNC_NAME = 'psa/work-scheme';
export const SEARCH_PSA_WORK_SCHEME = 'SEARCH_PSA_WORK_SCHEME';
export const CREATE_PSA_WORK_SCHEME = 'CREATE_PSA_WORK_SCHEME';
export const DELETE_PSA_WORK_SCHEME = 'DELETE_PSA_WORK_SCHEME';
export const UPDATE_PSA_WORK_SCHEME = 'UPDATE_PSA_WORK_SCHEME';
export const SEARCH_PSA_WORK_SCHEME_ERROR = 'SEARCH_PSA_WORK_SCHEME_ERROR';
export const CREATE_PSA_WORK_SCHEME_ERROR = 'CREATE_PSA_WORK_SCHEME_ERROR';
export const DELETE_PSA_WORK_SCHEME_ERROR = 'DELETE_PSA_WORK_SCHEME_ERROR';
export const UPDATE_PSA_WORK_SCHEME_ERROR = 'UPDATE_PSA_WORK_SCHEME_ERROR';

const searchSuccess = (type, records) => ({
  type,
  payload: records,
});

const searchError = (type) => ({
  type,
});

const search = (name, param, successType, errorType) => (dispatch) => {
  dispatch(loadingStart());
  const req = { path: `/${name}/search`, param };
  return Api.invoke(req)
    .then((result) => {
      dispatch(searchSuccess(successType, result.workSchemes));
      return result.workSchemes;
    })
    .catch((err) => {
      dispatch(searchError(errorType));
      dispatch(catchApiError(err, { isContinuable: true }));
      throw err;
    })
    .finally(() => dispatch(loadingEnd()));
};

export const searchPsaWorkScheme = (param = {}) => {
  return search(
    FUNC_NAME,
    param,
    SEARCH_PSA_WORK_SCHEME,
    SEARCH_PSA_WORK_SCHEME_ERROR
  );
};

export const createPsaWorkScheme = (param) => {
  return base.save(
    FUNC_NAME,
    param,
    CREATE_PSA_WORK_SCHEME,
    CREATE_PSA_WORK_SCHEME_ERROR
  );
};

export const deletePsaWorkScheme = (param) => {
  return base.del(
    FUNC_NAME,
    param,
    DELETE_PSA_WORK_SCHEME,
    DELETE_PSA_WORK_SCHEME_ERROR
  );
};

export const updatePsaWorkScheme = (param) => {
  return base.save(
    FUNC_NAME,
    param,
    UPDATE_PSA_WORK_SCHEME,
    UPDATE_PSA_WORK_SCHEME_ERROR
  );
};
