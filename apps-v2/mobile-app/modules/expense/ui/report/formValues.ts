import { Reducer } from 'redux';

import { Report } from '../../../../../domain/models/exp/Report';

import { AppDispatch } from '../../AppThunk';

export const ACTIONS = {
  SAVE_VALUES: 'MODULES/EXPENSE/UI/REPORT/FORM_VALUES/SAVE_VALUES',
  CLEAR_FORM: 'MODULES/EXPENSE/UI/REPORT/FORM_VALUES/CLEAR_FORM',
};

const formValues = (body: Report) => ({
  type: ACTIONS.SAVE_VALUES,
  payload: body,
});

const clearForm = () => ({
  type: ACTIONS.CLEAR_FORM,
  payload: {},
});

export const actions = {
  save: (values: Report) => (dispatch: AppDispatch) =>
    dispatch(formValues(values)),
  clear: () => (dispatch: AppDispatch) => dispatch(clearForm()),
};

const initialState = {};

export default ((state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.SAVE_VALUES:
      return action.payload;
    case ACTIONS.CLEAR_FORM:
      return action.payload;
    default:
      return state;
  }
}) as Reducer<Report | Record<string, never>, any>;
