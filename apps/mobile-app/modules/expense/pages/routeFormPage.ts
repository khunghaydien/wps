import { Reducer } from 'redux';

import { AppDispatch } from '../AppThunk';

// To keep track of which screen opened record
export const UI_TYPE = {
  ADD: 'add', // New record through `Add Record` in Report Detail page
  REPORT: 'report', // View or Edit record through record list inside Report Detail page
};

export const ACTIONS = {
  SAVE_SUCCESS: 'MODULES/PAGES/EXP/ROUTE_FORM_PAGE/SAVE_SUCCESS',
  CLEAR_SUCCESS: 'MODULES/PAGES/EXP/ROUTE_FORM_PAGE/CLEAR_SUCCESS',
};

const saveSuccess = (routeFormParams: any) => ({
  type: ACTIONS.SAVE_SUCCESS,
  payload: routeFormParams,
});

const clearSuccess = () => ({
  type: ACTIONS.CLEAR_SUCCESS,
});

export const actions = {
  save: (routeFormParams: any) => (dispatch: AppDispatch) =>
    dispatch(saveSuccess(routeFormParams)),
  clear: () => (dispatch: AppDispatch) => dispatch(clearSuccess()),
};

const initialState = {};

export default ((state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.SAVE_SUCCESS:
      return action.payload;
    case ACTIONS.CLEAR_SUCCESS:
      return initialState;
    default:
      return state;
  }
}) as Reducer<any, any>;
