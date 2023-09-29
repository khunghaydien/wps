import { Reducer } from 'redux';

import {
  initialStatePreRequest,
  Report,
  updateFiledValue,
} from '../../../../domain/models/exp/Report';

import { ACTIONS as SELECTED_EXP_REPORT_ACTIONS } from './selectedExpReport';

export const ACTIONS = {
  SET: 'MODULES/UI/EXPENSES/EDITING_EXP_REPORT/SET',
  SET_FIELD_VALUE: 'MODULES/UI/EXPENSES/EDITING_EXP_REPORT/SET_FIELD_VALUE',
  CLEAR: 'MODULES/UI/EXPENSES/EDITING_EXP_REPORT/CLEAR',
};

export const actions = {
  set: (expReport: Report) => ({
    type: ACTIONS.SET,
    payload: expReport,
  }),
  setFieldValue: (key: string, value: string) => ({
    type: ACTIONS.SET_FIELD_VALUE,
    payload: { key, value },
  }),
  clear: () => ({
    type: ACTIONS.CLEAR,
  }),
};

export default ((state = initialStatePreRequest, action) => {
  switch (action.type) {
    case SELECTED_EXP_REPORT_ACTIONS.SELECT:
    case ACTIONS.SET:
      return action.payload;
    case ACTIONS.SET_FIELD_VALUE:
      return updateFiledValue(state, action.payload.key, action.payload.value);
    case ACTIONS.CLEAR:
    case SELECTED_EXP_REPORT_ACTIONS.NEW_REPORT:
      return initialStatePreRequest;
    default:
      return state;
  }
}) as Reducer<Report, any>;
