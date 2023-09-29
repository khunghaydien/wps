import {
  catchApiError,
  loadingEnd,
  loadingStart,
} from '../../commons/actions/app';
import Api from '../../commons/api';

import * as base from './base';

const FUNC_NAME = 'psa/skillset';
export const SEARCH_SKILLSET = 'SEARCH_SKILLSET';
export const CREATE_SKILLSET = 'CREATE_SKILLSET';
export const DELETE_SKILLSET = 'DELETE_SKILLSET';
export const UPDATE_SKILLSET = 'UPDATE_SKILLSET';
export const SEARCH_SKILLSET_ERROR = 'SEARCH_SKILLSET_ERROR';
export const CREATE_SKILLSET_ERROR = 'CREATE_SKILLSET_ERROR';
export const DELETE_SKILLSET_ERROR = 'DELETE_SKILLSET_ERROR';
export const UPDATE_SKILLSET_ERROR = 'UPDATE_SKILLSET_ERROR';
export const GET_CONSTANTS_SKILLSET = 'GET_CONSTANTS_SKILLSET';

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
      dispatch(searchSuccess(successType, result.skillsets));
      return result.skillsets;
    })
    .catch((err) => {
      dispatch(searchError(errorType));
      dispatch(catchApiError(err, { isContinuable: true }));
      throw err;
    })
    .finally(() => dispatch(loadingEnd()));
};

export const searchSkillset = (param = {}) => {
  return search(FUNC_NAME, param, SEARCH_SKILLSET, SEARCH_SKILLSET_ERROR);
};

export const createSkillset = (param) => {
  return base.save(FUNC_NAME, param, CREATE_SKILLSET, CREATE_SKILLSET_ERROR);
};

export const deleteSkillset = (param) => {
  return base.del(FUNC_NAME, param, DELETE_SKILLSET, DELETE_SKILLSET_ERROR);
};

export const updateSkillset = (param) => {
  return base.save(FUNC_NAME, param, UPDATE_SKILLSET, UPDATE_SKILLSET_ERROR);
};

export const getConstantsSkillset = () => ({
  type: GET_CONSTANTS_SKILLSET,
});
