import {
  catchApiError,
  loadingEnd,
  loadingStart,
} from '../../commons/actions/app';
import Api from '../../commons/api';

import * as base from './base';

const FUNC_NAME = 'job';
export const CREATE_JOB = 'CREATE_JOB';
export const DELETE_JOB = 'DELETE_JOB';
export const UPDATE_JOB = 'UPDATE_JOB';
export const CREATE_JOB_ERROR = 'CREATE_JOB_ERROR';
export const DELETE_JOB_ERROR = 'DELETE_JOB_ERROR';
export const SEARCH_JOB_ERROR = 'SEARCH_JOB_ERROR';
export const UPDATE_JOB_ERROR = 'UPDATE_JOB_ERROR';
export const GET_CONSTANTS_SCOPED_ASSIGNMENT =
  'GET_CONSTANTS_SCOPED_ASSIGNMENT';

function createJobSuccess() {
  return {
    type: CREATE_JOB,
  };
}

function updateJobSuccess() {
  return {
    type: UPDATE_JOB,
  };
}

function createJobError() {
  return {
    type: CREATE_JOB_ERROR,
  };
}

function updateJobError() {
  return {
    type: UPDATE_JOB_ERROR,
  };
}
function toRemoteFormat(param) {
  return base.convertToRemoteFormat({
    ...param,
  });
}

export const getConstantsScopedAssignment = () => ({
  type: GET_CONSTANTS_SCOPED_ASSIGNMENT,
});
export const createJob = (param) => (dispatch) => {
  const req = {
    path: '/job/create',
    param: toRemoteFormat(param),
  };
  dispatch(loadingStart());
  return Api.invoke(req)
    .then((_result) => {
      dispatch(loadingEnd());
      dispatch(createJobSuccess());
    })
    .catch((err) => {
      dispatch(loadingEnd());
      dispatch(createJobError());
      dispatch(catchApiError(err, { isContinuable: true }));
      throw err;
    });
};

export const deleteJob = (param) => {
  return base.del(FUNC_NAME, param, DELETE_JOB, DELETE_JOB_ERROR);
};

export const updateJob = (param) => (dispatch) => {
  dispatch(loadingStart());
  const req = {
    path: '/job/update',
    param: toRemoteFormat(param),
  };
  return Api.invoke(req)
    .then(() => {
      dispatch(loadingEnd());
      dispatch(updateJobSuccess());
    })
    .catch((err) => {
      dispatch(loadingEnd());
      dispatch(updateJobError());
      dispatch(catchApiError(err, { isContinuable: true }));
      throw err;
    });
};
