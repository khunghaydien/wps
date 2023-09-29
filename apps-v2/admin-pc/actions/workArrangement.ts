import {
  catchApiError,
  loadingEnd,
  loadingStart,
} from '@apps/commons/actions/app';
import Api from '@apps/commons/api';

import * as base from './base';

const FUNC_NAME = 'psa/work-arrangement';
export const SEARCH_WORK_ARRANGEMENT = 'SEARCH_WORK_ARRANGEMENT';
export const CREATE_WORK_ARRANGEMENT = 'CREATE_WORK_ARRANGEMENT';
export const DELETE_WORK_ARRANGEMENT = 'DELETE_WORK_ARRANGEMENT';
export const UPDATE_WORK_ARRANGEMENT = 'UPDATE_WORK_ARRANGEMENT';
export const SEARCH_WORK_ARRANGEMENT_ERROR = 'SEARCH_WORK_ARRANGEMENT_ERROR';
export const CREATE_WORK_ARRANGEMENT_ERROR = 'CREATE_WORK_ARRANGEMENT_ERROR';
export const DELETE_WORK_ARRANGEMENT_ERROR = 'DELETE_WORK_ARRANGEMENT_ERROR';
export const UPDATE_WORK_ARRANGEMENT_ERROR = 'UPDATE_WORK_ARRANGEMENT_ERROR';

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
      dispatch(searchSuccess(successType, result.workArrangements));
      return result.workSchemes;
    })
    .catch((err) => {
      dispatch(searchError(errorType));
      dispatch(catchApiError(err, { isContinuable: true }));
      throw err;
    })
    .finally(() => dispatch(loadingEnd()));
};

export const searchWorkArrangement = (param = {}) => {
  return search(
    FUNC_NAME,
    param,
    SEARCH_WORK_ARRANGEMENT,
    SEARCH_WORK_ARRANGEMENT_ERROR
  );
};

export const createWorkArrangement = (param) => {
  return base.save(
    FUNC_NAME,
    param,
    CREATE_WORK_ARRANGEMENT,
    CREATE_WORK_ARRANGEMENT_ERROR
  );
};

export const deleteWorkArrangement = (param) => {
  return base.del(
    FUNC_NAME,
    param,
    DELETE_WORK_ARRANGEMENT,
    DELETE_WORK_ARRANGEMENT_ERROR
  );
};

export const updateWorkArrangement = (param) => {
  return base.save(
    FUNC_NAME,
    param,
    UPDATE_WORK_ARRANGEMENT,
    UPDATE_WORK_ARRANGEMENT_ERROR
  );
};
