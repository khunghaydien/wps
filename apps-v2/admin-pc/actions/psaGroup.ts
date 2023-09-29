import {
  catchApiError,
  loadingEnd,
  loadingStart,
} from '../../commons/actions/app';
import Api from '../../commons/api';

import * as base from './base';

const FUNC_NAME = 'psa/group';
export const SEARCH_PSA_GROUP = 'SEARCH_PSA_GROUP';
export const CREATE_PSA_GROUP = 'CREATE_PSA_GROUP';
export const GET_PSA_GROUP = 'GET_PSA_GROUP';
export const DELETE_PSA_GROUP = 'DELETE_PSA_GROUP';
export const UPDATE_PSA_GROUP = 'UPDATE_PSA_GROUP';
export const SEARCH_PSA_GROUP_ERROR = 'SEARCH_PSA_GROUP_ERROR';
export const CREATE_PSA_GROUP_ERROR = 'CREATE_PSA_GROUP_ERROR';
export const GET_PSA_GROUP_ERROR = 'GET_PSA_GROUP_ERROR';
export const DELETE_PSA_GROUP_ERROR = 'DELETE_PSA_GROUP_ERROR';
export const UPDATE_PSA_GROUP_ERROR = 'UPDATE_PSA_GROUP_ERROR';

const searchSuccess = (type, records) => ({
  type,
  payload: records,
});

const searchError = (type) => ({
  type,
});

const search = (name, param, successType, errorType) => (dispatch) => {
  dispatch(loadingStart());
  const req = { path: `/${name}/list`, param };
  return Api.invoke(req)
    .then((result) => {
      dispatch(searchSuccess(successType, result.groups));
      return result.groups;
    })
    .catch((err) => {
      dispatch(searchError(errorType));
      dispatch(catchApiError(err, { isContinuable: true }));
      throw err;
    })
    .finally(() => dispatch(loadingEnd()));
};

const searchByUser = (name, param, successType, errorType) => (dispatch) => {
  dispatch(loadingStart());
  const req = { path: `/${name}/list/user`, param };
  return Api.invoke(req)
    .then((result) => {
      dispatch(searchSuccess(successType, result.groups));
      return result.groups;
    })
    .catch((err) => {
      dispatch(searchError(errorType));
      dispatch(catchApiError(err, { isContinuable: true }));
      throw err;
    })
    .finally(() => dispatch(loadingEnd()));
};

const clearOptions = (successType) => (dispatch) => {
  dispatch(searchSuccess(successType, []));
};

export const clearPsaGroupOptions = () => {
  return clearOptions(SEARCH_PSA_GROUP);
};

export const searchPSAGroup = (param = {}) => {
  const finalParam = {
    ...param,
    types: ['PsaGroup'],
  };
  return search(
    FUNC_NAME,
    finalParam,
    SEARCH_PSA_GROUP,
    SEARCH_PSA_GROUP_ERROR
  );
};

export const searchPSAGroupByUser = (param = {}) => {
  // @ts-ignore
  if (param.employeeId === '' || param.employeeId === undefined) {
    return clearOptions;
  }
  const finalParam = {
    ...param,
  };
  return searchByUser(
    FUNC_NAME,
    finalParam,
    SEARCH_PSA_GROUP,
    SEARCH_PSA_GROUP_ERROR
  );
};

export const getPSAGroup = (param) => {
  return base.get(FUNC_NAME, param, GET_PSA_GROUP, GET_PSA_GROUP_ERROR);
};

export const createPSAGroup = (param) => {
  return base.save(FUNC_NAME, param, CREATE_PSA_GROUP, CREATE_PSA_GROUP_ERROR);
};

export const deletePSAGroup = (param) => {
  return base.del(FUNC_NAME, param, DELETE_PSA_GROUP, DELETE_PSA_GROUP_ERROR);
};

export const updatePSAGroup = (param) => {
  return base.save(FUNC_NAME, param, UPDATE_PSA_GROUP, UPDATE_PSA_GROUP_ERROR);
};
