import { Reducer } from 'redux';

import { ProgressBarStep } from '../../../../../commons/components/ProgressBar';

export const ACTIONS = {
  SET: 'MODULES/EXPENSES/DIALOG/PROGRESSBAR/SET',
  CLEAR: 'MODULES/EXPENSES/DIALOG/CLEAR',
};

export const actions = {
  set: (steps: Array<ProgressBarStep>) => ({
    type: ACTIONS.SET,
    payload: steps,
  }),
  clear: () => ({
    type: ACTIONS.CLEAR,
  }),
};

const initialState = [];

export default ((state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.SET:
      return action.payload;
    case ACTIONS.CLEAR:
      return initialState;
    default:
      return state;
  }
}) as Reducer<Array<ProgressBarStep>, any>;
