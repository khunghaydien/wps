import * as base from './base';

const FUNC_NAME = 'att/rest-reason';
export const SEARCH_REST_REASON = 'SEARCH_REST_REASON';
export const CREATE_REST_REASON = 'CREATE_REST_REASON';
export const DELETE_REST_REASON = 'DELETE_REST_REASON';
export const UPDATE_REST_REASON = 'UPDATE_REST_REASON';
export const SEARCH_REST_REASON_ERROR = 'SEARCH_REST_REASON_ERROR';
export const CREATE_REST_REASON_ERROR = 'CREATE_REST_REASON_ERROR';
export const DELETE_REST_REASON_ERROR = 'DELETE_REST_REASON_ERROR';
export const UPDATE_REST_REASON_ERROR = 'UPDATE_REST_REASON_ERROR';
export const GET_CONSTANTS_REST_REASON = 'GET_CONSTANTS_REST_REASON';

export const searchRestReason = (param = {}) => {
  return base.search(
    FUNC_NAME,
    param,
    SEARCH_REST_REASON,
    SEARCH_REST_REASON_ERROR
  );
};

export const createRestReason = (param) => {
  return base.create(
    FUNC_NAME,
    param,
    CREATE_REST_REASON,
    CREATE_REST_REASON_ERROR
  );
};

export const deleteRestReason = (param) => {
  return base.del(
    FUNC_NAME,
    param,
    DELETE_REST_REASON,
    DELETE_REST_REASON_ERROR
  );
};

export const updateRestReason = (param) => {
  return base.update(
    FUNC_NAME,
    param,
    UPDATE_REST_REASON,
    UPDATE_REST_REASON_ERROR
  );
};

export const getConstantsRestReason = () => ({
  type: GET_CONSTANTS_REST_REASON,
});
