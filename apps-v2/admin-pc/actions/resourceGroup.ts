import {
  catchApiError,
  loadingEnd,
  loadingStart,
} from '../../commons/actions/app';
import Api from '../../commons/api';

import * as base from './base';

const FUNC_NAME = 'psa/group';
export const SEARCH_RESOURCE_GROUP = 'SEARCH_RESOURCE_GROUP';
export const SEARCH_RM_RESOURCE_GROUP = 'SEARCH_RM_RESOURCE_GROUP';
export const CREATE_RESOURCE_GROUP = 'CREATE_RESOURCE_GROUP';
export const GET_RESOURCE_GROUP = 'GET_RESOURCE_GROUP';
export const DELETE_RESOURCE_GROUP = 'DELETE_RESOURCE_GROUP';
export const UPDATE_RESOURCE_GROUP = 'UPDATE_RESOURCE_GROUP';
export const SEARCH_RESOURCE_GROUP_ERROR = 'SEARCH_RESOURCE_GROUP_ERROR';
export const SEARCH_RM_RESOURCE_GROUP_ERROR = 'SEARCH_RM_RESOURCE_GROUP_ERROR';
export const GET_RESOURCE_GROUP_ERROR = 'GET_RESOURCE_GROUP_ERROR';
export const CREATE_RESOURCE_GROUP_ERROR = 'CREATE_RESOURCE_GROUP_ERROR';
export const DELETE_RESOURCE_GROUP_ERROR = 'DELETE_RESOURCE_GROUP_ERROR';
export const UPDATE_RESOURCE_GROUP_ERROR = 'UPDATE_RESOURCE_GROUP_ERROR';

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

export const searchResourceGroup = (param = {}) => {
  const finalParam = {
    ...param,
    types: ['ResourceGroup'],
  };
  return search(
    FUNC_NAME,
    finalParam,
    SEARCH_RESOURCE_GROUP,
    SEARCH_RESOURCE_GROUP_ERROR
  );
};

export const searchRMResourceGroup = ({ companyId, ownerId }) => {
  const param = {
    companyId,
    ownerId,
  };
  return search(
    `${FUNC_NAME}/resource-group`,
    param,
    SEARCH_RM_RESOURCE_GROUP,
    SEARCH_RM_RESOURCE_GROUP_ERROR
  );
};

export const getResourceGroup = (param) => {
  return base.get(
    FUNC_NAME,
    param,
    GET_RESOURCE_GROUP,
    GET_RESOURCE_GROUP_ERROR
  );
};

function formatParamToFitBE(param) {
  const formattedMembers = param.members
    ? param.members.map((_) => ({
        employeeId: _.employeeId,
        type: 'Member',
      }))
    : [];

  const formattedOwners = param.owners
    ? param.owners.map((_) => ({
        employeeId: _.employeeId,
        type: 'Owner',
      }))
    : [];

  return {
    ...param,
    owners: null,
    members: [...formattedMembers, ...formattedOwners],
  };
}

export const createResourceGroup = (param) => {
  const formattedParam = formatParamToFitBE(param);

  return base.save(
    FUNC_NAME,
    formattedParam,
    CREATE_RESOURCE_GROUP,
    CREATE_RESOURCE_GROUP_ERROR
  );
};

export const deletehResourceGroup = (param) => {
  return base.del(
    FUNC_NAME,
    param,
    DELETE_RESOURCE_GROUP,
    DELETE_RESOURCE_GROUP_ERROR
  );
};

export const updateResourceGroup = (param) => {
  const formattedParam = formatParamToFitBE(param);

  return base.save(
    FUNC_NAME,
    formattedParam,
    UPDATE_RESOURCE_GROUP,
    UPDATE_RESOURCE_GROUP_ERROR
  );
};
