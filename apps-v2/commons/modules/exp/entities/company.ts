import { Dispatch, Reducer } from 'redux';

import _ from 'lodash';

export const ACTIONS = {
  SET_COMPANIES: 'COMMONS/EXP/ENTITIES/EMPLOYEE_DETAILS/SET_COMPANIES',
};

const setCompanies = (companies: any) => ({
  type: ACTIONS.SET_COMPANIES,
  payload: companies,
});

export const actions = {
  setCompanies:
    (companies: any) =>
    (dispatch: Dispatch<any>): void => {
      dispatch(setCompanies(companies));
    },
};

const initialState = [];

export default ((state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.SET_COMPANIES:
      return action.payload;
    default:
      return state;
  }
}) as Reducer<any, any>;
