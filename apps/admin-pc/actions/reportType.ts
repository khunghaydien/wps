import * as base from './base';

const FUNC_NAME = 'exp/report-type';
export const SEARCH_REPORTTYPE = 'SEARCH_REPORTTYPE';
export const SEARCH_REPORTTYPE_BY_ID = 'SEARCH_REPORTTYPE_BY_ID';
export const CREATE_REPORTTYPE = 'CREATE_REPORTTYPE';
export const DELETE_REPORTTYPE = 'DELETE_REPORTTYPE';
export const UPDATE_REPORTTYPE = 'UPDATE_REPORTTYPE';
export const SEARCH_REPORTTYPE_ERROR = 'SEARCH_REPORTTYPE_ERROR';
export const SEARCH_REPORTTYPE_BY_ID_ERROR = 'SEARCH_REPORTTYPE_BY_ID_ERROR';
export const CREATE_REPORTTYPE_ERROR = 'CREATE_REPORTTYPE_ERROR';
export const DELETE_REPORTTYPE_ERROR = 'DELETE_REPORTTYPE_ERROR';
export const UPDATE_REPORTTYPE_ERROR = 'UPDATE_REPORTTYPE_ERROR';
export const GET_CONSTANTS_VENDOR_USED = 'GET_CONSTANTS_VENDOR_USED';
export const GET_CONSTANTS_JOB_USED = 'GET_CONSTANTS_JOB_USED';
export const GET_CONSTANTS_COST_CENTER_USED = 'GET_CONSTANTS_COST_CENTER_USED';

export const searchReportType = (param = {}) => {
  return base.search(
    FUNC_NAME,
    param,
    SEARCH_REPORTTYPE,
    SEARCH_REPORTTYPE_ERROR
  );
};

export const createReportType = (param) => {
  return base.create(
    FUNC_NAME,
    param,
    CREATE_REPORTTYPE,
    CREATE_REPORTTYPE_ERROR
  );
};

export const deleteReportType = (param) => {
  return base.del(FUNC_NAME, param, DELETE_REPORTTYPE, DELETE_REPORTTYPE_ERROR);
};

export const updateReportType = (param) => {
  return base.update(
    FUNC_NAME,
    param,
    UPDATE_REPORTTYPE,
    UPDATE_REPORTTYPE_ERROR
  );
};

export const searchReportTypeById = (param) => {
  return base.search(
    FUNC_NAME,
    param,
    SEARCH_REPORTTYPE_BY_ID,
    SEARCH_REPORTTYPE_BY_ID_ERROR
  );
};

export const getConstantsVendorUsed = () => ({
  type: GET_CONSTANTS_VENDOR_USED,
});

export const getConstantsJobUsed = () => ({
  type: GET_CONSTANTS_JOB_USED,
});

export const getConstantsCostCenterUsed = () => ({
  type: GET_CONSTANTS_COST_CENTER_USED,
});
