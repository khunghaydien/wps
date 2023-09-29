import {
  catchApiError,
  loadingEnd,
  loadingStart,
} from '../../commons/actions/app';
import Api from '../../commons/api';

import * as base from './base';

const FUNC_NAME = 'psa/jobgrade';
export const SEARCH_JOB_GRADE = 'SEARCH_JOB_GRADE';
export const CREATE_JOB_GRADE = 'CREATE_JOB_GRADE';
export const DELETE_JOB_GRADE = 'DELETE_JOB_GRADE';
export const UPDATE_JOB_GRADE = 'UPDATE_JOB_GRADE';
export const SEARCH_JOB_GRADE_ERROR = 'SEARCH_JOB_GRADE_ERROR';
export const CREATE_JOB_GRADE_ERROR = 'CREATE_JOB_GRADE_ERROR';
export const DELETE_JOB_GRADE_ERROR = 'DELETE_JOB_GRADE_ERROR';
export const UPDATE_JOB_GRADE_ERROR = 'UPDATE_JOB_GRADE_ERROR';

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
      dispatch(searchSuccess(successType, result.jobGrades));
      return result.jobGrades;
    })
    .catch((err) => {
      dispatch(searchError(errorType));
      dispatch(catchApiError(err, { isContinuable: true }));
      throw err;
    })
    .finally(() => dispatch(loadingEnd()));
};

export const searchJobGrade = (param = {}) => {
  return search(FUNC_NAME, param, SEARCH_JOB_GRADE, SEARCH_JOB_GRADE_ERROR);
};

export const createJobGrade = (param) => {
  return base.save(FUNC_NAME, param, CREATE_JOB_GRADE, CREATE_JOB_GRADE_ERROR);
};

export const deleteJobGrade = (param) => {
  return base.del(FUNC_NAME, param, DELETE_JOB_GRADE, DELETE_JOB_GRADE_ERROR);
};

export const updateJobGrade = (param) => {
  return base.save(FUNC_NAME, param, UPDATE_JOB_GRADE, UPDATE_JOB_GRADE_ERROR);
};
