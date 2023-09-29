import * as base from './base';

const FUNC_NAME = 'job-type';
export const SEARCH_JOB_TYPE = 'SEARCH_JOB_TYPE';
export const CREATE_JOB_TYPE = 'CREATE_JOB_TYPE';
export const DELETE_JOB_TYPE = 'DELETE_JOB_TYPE';
export const UPDATE_JOB_TYPE = 'UPDATE_JOB_TYPE';
export const SEARCH_JOB_TYPE_ERROR = 'SEARCH_JOB_TYPE_ERROR';
export const CREATE_JOB_TYPE_ERROR = 'CREATE_JOB_TYPE_ERROR';
export const DELETE_JOB_TYPE_ERROR = 'DELETE_JOB_TYPE_ERROR';
export const UPDATE_JOB_TYPE_ERROR = 'UPDATE_JOB_TYPE_ERROR';

export const searchJobType = (param = {}) => {
  return base.search(FUNC_NAME, param, SEARCH_JOB_TYPE, SEARCH_JOB_TYPE_ERROR);
};

export const createJobType = (param) => {
  return base.create(FUNC_NAME, param, CREATE_JOB_TYPE, CREATE_JOB_TYPE_ERROR);
};

export const deleteJobType = (param) => {
  return base.del(FUNC_NAME, param, DELETE_JOB_TYPE, DELETE_JOB_TYPE_ERROR);
};

export const updateJobType = (param) => {
  return base.update(FUNC_NAME, param, UPDATE_JOB_TYPE, UPDATE_JOB_TYPE_ERROR);
};
