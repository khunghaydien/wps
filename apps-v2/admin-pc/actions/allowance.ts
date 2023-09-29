import * as base from './base';

const FUNC_NAME = 'att/allowance';
export const SEARCH_ALLOWANCE = 'SEARCH_ALLOWANCE';
export const CREATE_ALLOWANCE = 'CREATE_ALLOWANCE';
export const DELETE_ALLOWANCE = 'DELETE_ALLOWANCE';
export const UPDATE_ALLOWANCE = 'UPDATE_ALLOWANCE';
export const SEARCH_ALLOWANCE_ERROR = 'SEARCH_ALLOWANCE_ERROR';
export const CREATE_ALLOWANCE_ERROR = 'CREATE_ALLOWANCE_ERROR';
export const DELETE_ALLOWANCE_ERROR = 'DELETE_ALLOWANCE_ERROR';
export const UPDATE_ALLOWANCE_ERROR = 'UPDATE_ALLOWANCE_ERROR';
export const GET_CONSTANTS_ALLOWANCE = 'GET_CONSTANTS_ALLOWANCE';

export const searchAllowance = (param = {}) => {
  return base.search(
    FUNC_NAME,
    param,
    SEARCH_ALLOWANCE,
    SEARCH_ALLOWANCE_ERROR
  );
};

export const createAllowance = (param) => {
  return base.create(
    FUNC_NAME,
    param,
    CREATE_ALLOWANCE,
    CREATE_ALLOWANCE_ERROR
  );
};

export const deleteAllowance = (param) => {
  return base.del(FUNC_NAME, param, DELETE_ALLOWANCE, DELETE_ALLOWANCE_ERROR);
};

export const updateAllowance = (param) => {
  return base.update(
    FUNC_NAME,
    param,
    UPDATE_ALLOWANCE,
    UPDATE_ALLOWANCE_ERROR
  );
};

export const getConstantsAllowance = () => ({
  type: GET_CONSTANTS_ALLOWANCE,
});
