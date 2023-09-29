import { Reducer } from 'redux';

import { IcTransactionWithCardNo } from '@apps/domain/models/exp/TransportICCard';

export const ACTIONS = {
  SET: 'MODULES/UI/EXP/IC_TRANSACTION_SELECT/SELECTED/SET',
  CLEAR: 'MODULES/UI/EXP/IC_TRANSACTION_SELECT/SELECTED/CLEAR',
};

export const actions = {
  set: (selected?: IcTransactionWithCardNo[]) => ({
    type: ACTIONS.SET,
    payload: selected,
  }),
  clear: () => ({ type: ACTIONS.CLEAR }),
};

type State = IcTransactionWithCardNo[];
const initialState = [];

export default ((state: State = initialState, action) => {
  switch (action.type) {
    case ACTIONS.SET:
      return action.payload;
    case ACTIONS.CLEAR:
      return initialState;
    default:
      return state;
  }
}) as Reducer<State, any>;
