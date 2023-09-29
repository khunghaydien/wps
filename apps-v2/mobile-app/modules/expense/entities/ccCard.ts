import { Reducer } from 'redux';

import { CardInfo } from '@apps/domain/models/exp/CreditCard';

export const ACTIONS = {
  SET: 'MODULES/EXPENSE/ENTITIES/CC_CARD/SET',
};

export const actions = {
  set: (ccCards: CardInfo[]) => ({
    type: ACTIONS.SET,
    payload: ccCards,
  }),
};

const initialState = [];

export default ((state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.SET:
      return action.payload;
    default:
      return state;
  }
}) as Reducer<CardInfo[], any>;
