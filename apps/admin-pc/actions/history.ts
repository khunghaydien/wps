import {
  catchApiError,
  loadingEnd,
  loadingStart,
} from '../../commons/actions/app';
import Api from '../../commons/api';

import { convertFromRemoteFormat, convertToRemoteFormat } from './base';

export const CREATE_HISTORY = 'CREATE_HISTORY';
export const SEARCH_HISTORY = 'SEARCH_HISTORY';
export const UPDATE_HISTORY = 'UPDATE_HISTORY';
export const DELETE_HISTORY = 'DELETE_HISTORY';
export const CREATE_HISTORY_ERROR = 'CREATE_HISTORY_ERROR';
export const SEARCH_HISTORY_ERROR = 'SEARCH_HISTORY_ERROR';
export const UPDATE_HISTORY_ERROR = 'UPDATE_HISTORY_ERROR';
export const DELETE_HISTORY_ERROR = 'DELETE_HISTORY_ERROR';
export const INITIALIZE_HISTORY = 'INITIALIZE_HISTORY';

const searchSuccess = (type, records) => ({
  type,
  payload: records,
});

const createSuccess = (type) => ({
  type,
});

const deleteSuccess = (type) => ({
  type,
});

const updateSuccess = (type) => ({
  type,
});

const searchError = (type) => ({
  type,
});

const createError = (type) => ({
  type,
});

const deleteError = (type) => ({
  type,
});

const updateError = (type) => ({
  type,
});

export const initializeHistory = () => ({
  type: INITIALIZE_HISTORY,
});

export const searchHistory =
  (name, param = {}, successType, errorType) =>
  (dispatch) => {
    dispatch(loadingStart());
    const req = { path: `/${name}/history/search`, param };
    return Api.invoke(req)
      .then((result) => {
        dispatch(loadingEnd());
        const records = (result.records || []).map(convertFromRemoteFormat);
        dispatch(searchSuccess(successType, records));
        return records;
      })
      .catch((err) => {
        dispatch(loadingEnd());
        dispatch(searchError(errorType));
        dispatch(catchApiError(err, { isContinuable: true }));
        throw err; // 後続（component/MainContent）のthenをスキップさせる
      });
  };

export const createHistory =
  (name, param, successType, errorType) => (dispatch) => {
    dispatch(loadingStart());
    const req = {
      path: `/${name}/history/create`,
      param: convertToRemoteFormat(param),
    };
    return Api.invoke(req)
      .then((res) => {
        dispatch(loadingEnd());
        dispatch(createSuccess(successType));
        return res;
      })
      .catch((err) => {
        dispatch(loadingEnd());
        dispatch(createError(errorType));
        dispatch(catchApiError(err, { isContinuable: true }));
        throw err; // 後続（component/MainContent）のthenをスキップさせる
      });
  };

export const updateHistory =
  (name, param, successType, errorType) => (dispatch) => {
    dispatch(loadingStart());
    const req = {
      path: `/${name}/history/update`,
      param: convertToRemoteFormat(param),
    };
    return Api.invoke(req)
      .then(() => {
        dispatch(loadingEnd());
        dispatch(updateSuccess(successType));
      })
      .catch((err) => {
        dispatch(loadingEnd());
        dispatch(updateError(errorType));
        dispatch(catchApiError(err, { isContinuable: true }));
        throw err; // 後続（component/MainContent）のthenをスキップさせる
      });
  };

export const deleteHistory =
  (name, param, successType, errorType) => (dispatch) => {
    dispatch(loadingStart());
    const req = { path: `/${name}/history/delete`, param };
    return Api.invoke(req)
      .then(() => {
        dispatch(loadingEnd());
        dispatch(deleteSuccess(successType));
      })
      .catch((err) => {
        dispatch(loadingEnd());
        dispatch(deleteError(errorType));
        dispatch(catchApiError(err, { isContinuable: true }));
        throw err; // 後続（component/MainContent）のthenをスキップさせる
      });
  };
