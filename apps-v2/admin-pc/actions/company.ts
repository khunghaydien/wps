import * as base from './base';

const FUNC_NAME = 'company';
export const SEARCH_COMPANY = 'SEARCH_COMPANY';
export const CREATE_COMPANY = 'CREATE_COMPANY';
export const DELETE_COMPANY = 'DELETE_COMPANY';
export const UPDATE_COMPANY = 'UPDATE_COMPANY';
export const SEARCH_COMPANY_ERROR = 'SEARCH_COMPANY_ERROR';
export const CREATE_COMPANY_ERROR = 'CREATE_COMPANY_ERROR';
export const DELETE_COMPANY_ERROR = 'DELETE_COMPANY_ERROR';
export const UPDATE_COMPANY_ERROR = 'UPDATE_COMPANY_ERROR';
export const SET_DEFAULT_LANGUAGE = 'SET_DEFAULT_LANGUAGE';

export const setDefaultLangage = (lang) => {
  return {
    type: SET_DEFAULT_LANGUAGE,
    payload: lang,
  };
};

export const searchCompany = (param = {}) => {
  return base.search(FUNC_NAME, param, SEARCH_COMPANY, SEARCH_COMPANY_ERROR);
};

export const createCompany = (param) => {
  // Temporary implementation for Planner Default View
  // TODO Remove this
  return base.create(
    FUNC_NAME,
    {
      ...param,
      plannerDefaultView: param.plannerDefaultView ? 'Daily' : 'Weekly',
    },
    CREATE_COMPANY,
    CREATE_COMPANY_ERROR
  );
};

export const deleteCompany = (param) => {
  return base.del(FUNC_NAME, param, DELETE_COMPANY, DELETE_COMPANY_ERROR);
};

export const updateCompany = (param) => {
  // Temporary implementation for Planner Default View
  // TODO Remove this
  return base.update(
    FUNC_NAME,
    {
      ...param,
      plannerDefaultView: param.plannerDefaultView ? 'Daily' : 'Weekly',
    },
    UPDATE_COMPANY,
    UPDATE_COMPANY_ERROR
  );
};
