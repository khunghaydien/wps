import * as base from './base';

const FUNC_NAME = 'exp/vendor';
export const SEARCH_VENDOR = 'SEARCH_VENDOR';
export const CREATE_VENDOR = 'CREATE_VENDOR';
export const DELETE_VENDOR = 'DELETE_VENDOR';
export const UPDATE_VENDOR = 'UPDATE_VENDOR';
export const SEARCH_VENDOR_ERROR = 'SEARCH_VENDOR_ERROR';
export const CREATE_VENDOR_ERROR = 'CREATE_VENDOR_ERROR';
export const DELETE_VENDOR_ERROR = 'DELETE_VENDOR_ERROR';
export const UPDATE_VENDOR_ERROR = 'UPDATE_VENDOR_ERROR';
export const GET_CONSTANTS_BANK_ACCOUNT_TYPE =
  'GET_CONSTANTS_BANK_ACCOUNT_TYPE';

export const searchVendor = (param = {}) => {
  return base.search(FUNC_NAME, param, SEARCH_VENDOR, SEARCH_VENDOR_ERROR);
};

export const createVendor = (param) => {
  return base.create(FUNC_NAME, param, CREATE_VENDOR, CREATE_VENDOR_ERROR);
};

export const deleteVendor = (param) => {
  return base.del(FUNC_NAME, param, DELETE_VENDOR, DELETE_VENDOR_ERROR);
};

export const updateVendor = (param) => {
  return base.update(FUNC_NAME, param, UPDATE_VENDOR, UPDATE_VENDOR_ERROR);
};

export const getConstantsBankAccountType = () => ({
  type: GET_CONSTANTS_BANK_ACCOUNT_TYPE,
});
