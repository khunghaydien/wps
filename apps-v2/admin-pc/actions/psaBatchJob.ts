import {
  catchApiError,
  loadingEnd,
  loadingStart,
} from '@apps/commons/actions/app';
import Api from '@apps/commons/api';

const FUNC_NAME = 'psa/batchjob';
export const GET_PSA_BATCH_JOB = 'GET_PSA_BATCH_JOB';
export const RUN_PSA_BATCH_JOB = 'RUN_PSA_BATCH_JOB';
export const GET_PSA_BATCH_JOB_ERROR = 'GET_PSA_BATCH_JOB_ERROR';
export const RUN_PSA_BATCH_JOB_ERROR = 'RUN_PSA_BATCH_JOB_ERROR';

const searchSuccess = (type, records) => ({
  type,
  payload: records,
});
const searchError = (type) => ({
  type,
});

const get = (name, param, successType, errorType) => (dispatch) => {
  dispatch(loadingStart());
  const req = { path: `/${name}/get`, param };
  return Api.invoke(req)
    .then((res) => {
      dispatch(searchSuccess(successType, res.batchJobs));
      return res.batchJobs;
    })
    .catch((err) => {
      dispatch(searchError(errorType));
      dispatch(catchApiError(err, { isContinuable: true }));
      throw err;
    })
    .finally(() => dispatch(loadingEnd()));
};

export const getPsaBatchJob = (param = {}) => {
  return get(FUNC_NAME, param, GET_PSA_BATCH_JOB, GET_PSA_BATCH_JOB_ERROR);
};

const run = (name, param, successType, errorType) => (dispatch) => {
  dispatch(loadingStart());
  const req = { path: `/${name}/run`, param };
  return Api.invoke(req)
    .then((res) => {
      dispatch(searchSuccess(successType, res));
      return res;
    })
    .catch((err) => {
      dispatch(searchError(errorType));
      dispatch(catchApiError(err, { isContinuable: true }));
      throw err;
    })
    .finally(() => dispatch(loadingEnd()));
};

export const runPsaBatchJob = (param = {}) => {
  return run(FUNC_NAME, param, RUN_PSA_BATCH_JOB, RUN_PSA_BATCH_JOB_ERROR);
};
