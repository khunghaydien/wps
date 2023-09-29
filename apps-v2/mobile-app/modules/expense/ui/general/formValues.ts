import { Reducer } from 'redux';

import { Record } from '../../../../../domain/models/exp/Record';

import { AppDispatch } from '../../AppThunk';

export const ACTIONS = {
  SAVE_VALUES: 'MODULES/EXPENSE/UI/GENERAL/FORM_VALUES/SAVE_VALUES',
  CLEAR_FORM: 'MODULES/EXPENSE/UI/GENERAL/FORM_VALUES/CLEAR_FORM',
};

const formValues = (body: Record) => ({
  type: ACTIONS.SAVE_VALUES,
  payload: body,
});

const clearForm = () => ({
  type: ACTIONS.CLEAR_FORM,
  payload: {},
});

export const actions = {
  save: (values: Record) => (dispatch: AppDispatch) =>
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
}) as Reducer<Record | { [key: string]: never }, any>;
