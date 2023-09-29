import { Reducer } from 'redux';

import { Transaction } from '../../../../../../domain/models/exp/CreditCard';

export const ACTIONS = {
  SET: 'MODULES/UI/EXP/TRANSACTION_SELECT/SELECTED/SET',
  CLEAR: 'MODULES/UI/EXP/TRANSACTION_SELECT/SELECTED/CLEAR',
};

export const actions = {
  set: (selected?: Transaction) => ({
    type: ACTIONS.SET,
    payload: selected,
  }),
  clear: () => ({ type: ACTIONS.CLEAR }),
};

const initialState = null;

export default ((state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.SET:
      return action.payload;
    case ACTIONS.CLEAR:
      return initialState;
    default:
      return state;
  }
}) as Reducer<Record<string, any>, any>;
