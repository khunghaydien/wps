import {
  catchApiError,
  loadingEnd,
  loadingStart,
} from '../../commons/actions/app';
import Api from '../../commons/api';

import * as base from './base';

const FUNC_NAME = 'psa/group';
export const SEARCH_PROJECT_MANAGER_GROUP = 'SEARCH_PROJECT_MANAGER_GROUP';
export const CREATE_PROJECT_MANAGER_GROUP = 'CREATE_PROJECT_MANAGER_GROUP';
export const DELETE_PROJECT_MANAGER_GROUP = 'DELETE_PROJECT_MANAGER_GROUP';
export const UPDATE_PROJECT_MANAGER_GROUP = 'UPDATE_PROJECT_MANAGER_GROUP';
export const SEARCH_PROJECT_MANAGER_GROUP_ERROR =
  'SEARCH_PROJECT_MANAGER_GROUP_ERROR';
export const CREATE_PROJECT_MANAGER_GROUP_ERROR =
  'CREATE_PROJECT_MANAGER_GROUP_ERROR';
export const DELETE_PROJECT_MANAGER_GROUP_ERROR =
  'DELETE_PROJECT_MANAGER_GROUP_ERROR';
export const UPDATE_PROJECT_MANAGER_GROUP_ERROR =
  'UPDATE_PROJECT_MANAGER_GROUP_ERROR';

const searchSuccess = (type, records) => ({
  type,
  payload: records,
});

const searchError = (type) => ({
  type,
});

const convertFromResponse = (response) => {
  return response.length !== 0
    ? response.map((record) => ({
        code: record.code,
        companyId: record.companyId,
        id: record.id,
        name: record.name,
        groupType: record.groupType,
      }))
    : response;
};

const search = (name, param, successType, errorType) => (dispatch) => {
  dispatch(loadingStart());
  const req = { path: `/${name}/list`, param };
  return Api.invoke(req)
    .then((result) => {
      dispatch(searchSuccess(successType, convertFromResponse(result.groups)));
      return result.groups;
    })
    .catch((err) => {
      dispatch(searchError(errorType));
      dispatch(catchApiError(err, { isContinuable: true }));
      throw err;
    })
    .finally(() => dispatch(loadingEnd()));
};

export const searchProjectManagerGroup = (param = {}) => {
  const finalParam = {
    ...param,
    types: ['ManagerGroup'],
  };
  return search(
    FUNC_NAME,
    finalParam,
    SEARCH_PROJECT_MANAGER_GROUP,
    SEARCH_PROJECT_MANAGER_GROUP_ERROR
  );
};

export const createProjectManagerGroup = (param) => {
  return base.save(
    FUNC_NAME,
    param,
    CREATE_PROJECT_MANAGER_GROUP,
    CREATE_PROJECT_MANAGER_GROUP_ERROR
  );
};

export const deletehProjectManagerGroup = (param) => {
  return base.del(
    FUNC_NAME,
    param,
    DELETE_PROJECT_MANAGER_GROUP,
    DELETE_PROJECT_MANAGER_GROUP_ERROR
  );
};

export const updateProjectManagerGroup = (param) => {
  const formattedMembers = param.members.map((_) => ({
    employeeId: _.employeeId,
    type: _.type,
  }));

  const formattedParam = {
    ...param,
    members: formattedMembers,
  };

  return base.save(
    FUNC_NAME,
    formattedParam,
    UPDATE_PROJECT_MANAGER_GROUP,
    UPDATE_PROJECT_MANAGER_GROUP_ERROR
  );
};
