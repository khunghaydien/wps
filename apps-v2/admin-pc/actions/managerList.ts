import {
  catchApiError,
  loadingEnd,
  loadingStart,
} from '../../commons/actions/app';
import Api from '../../commons/api';

import * as base from './base';

const FUNC_NAME = 'psa/group';
export const SEARCH_MANAGER_LIST = 'SEARCH_MANAGER_LIST';
export const CREATE_MANAGER_LIST = 'CREATE_MANAGER_LIST';
export const DELETE_MANAGER_LIST = 'DELETE_MANAGER_LIST';
export const UPDATE_MANAGER_LIST = 'UPDATE_MANAGER_LIST';
export const SEARCH_MANAGER_LIST_ERROR = 'SEARCH_MANAGER_LIST_ERROR';
export const CREATE_MANAGER_LIST_ERROR = 'CREATE_MANAGER_LIST_ERROR';
export const DELETE_MANAGER_LIST_ERROR = 'DELETE_MANAGER_LIST_ERROR';
export const UPDATE_MANAGER_LIST_ERROR = 'UPDATE_MANAGER_LIST_ERROR';

const searchSuccess = (type, records) => ({
  type,
  payload: records,
});

const searchError = (type) => ({
  type,
});

const convertFromResponse = (record) =>
  record.map((rec) => ({
    code: rec.code,
    companyId: rec.companyId,
    id: rec.id,
    name: rec.name,
    groupType: rec.groupType,
  }));

// // Auto initialize
const search = (name, param, successType, errorType) => async (dispatch) => {
  dispatch(loadingStart());
  const reqList = { path: `/${name}/list`, param };
  const initPM = {
    path: `/psa/group/save`,
    param: { companyId: param.companyId, groupType: 'PM', members: [] },
  };
  const initRM = {
    path: `/psa/group/save`,
    param: { companyId: param.companyId, groupType: 'RM', members: [] },
  };
  let result;
  result = await Api.invoke(reqList)
    .then((result) => {
      return result.groups;
    })
    .catch((err) => {
      dispatch(searchError(errorType));
      dispatch(catchApiError(err, { isContinuable: true }));
      dispatch(loadingEnd());
    });
  if (result && result.length < 2) {
    let needRefetch = false;
    if (result.filter((e) => e.groupType === 'PM').length === 0) {
      await Api.invoke(initPM)
        .then((res) => res)
        .catch((err) => {
          dispatch(searchError(errorType));
          dispatch(catchApiError(err, { isContinuable: true }));
          dispatch(loadingEnd());
        });
      needRefetch = true;
    }
    if (result.filter((e) => e.groupType === 'RM').length === 0) {
      await Api.invoke(initRM)
        .then((res) => res)
        .catch((err) => {
          dispatch(searchError(errorType));
          dispatch(catchApiError(err, { isContinuable: true }));
          dispatch(loadingEnd());
        });
      needRefetch = true;
    }
    if (needRefetch) {
      result = await Api.invoke(reqList)
        .then((result) => {
          return result.groups;
        })
        .catch((err) => {
          dispatch(searchError(errorType));
          dispatch(catchApiError(err, { isContinuable: true }));
          dispatch(loadingEnd());
        });
    }
  }

  dispatch(searchSuccess(successType, convertFromResponse(result)));
  dispatch(loadingEnd());
  return result;
};

export const searchManagerList = (param = {}) => {
  const finalParam = {
    ...param,
    types: ['PM', 'RM'],
  };
  return search(
    FUNC_NAME,
    finalParam,
    SEARCH_MANAGER_LIST,
    SEARCH_MANAGER_LIST_ERROR
  );
};

export const createManagerList = (param) => {
  return base.save(
    FUNC_NAME,
    param,
    CREATE_MANAGER_LIST,
    CREATE_MANAGER_LIST_ERROR
  );
};

export const deletehManagerList = (param) => {
  return base.del(
    FUNC_NAME,
    param,
    DELETE_MANAGER_LIST,
    DELETE_MANAGER_LIST_ERROR
  );
};

export const updateManagerList = (param) => {
  return base.save(
    FUNC_NAME,
    param,
    UPDATE_MANAGER_LIST,
    UPDATE_MANAGER_LIST_ERROR
  );
};
