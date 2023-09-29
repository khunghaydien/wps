import { Reducer } from 'redux';

import _ from 'lodash';

import { Transaction } from '@apps/domain/models/exp/CreditCard';

export const ACTIONS = {
  TOGGLE: 'MODULES/EXPENSE/UI/CREDIT_CARD/SELECTED_TRANSACTIONS/TOGGLE',
  CLEAR: 'MODULES/EXPENSE/UI/CREDIT_CARD/SELECTED_TRANSACTIONS/CLEAR',
};

export const actions = {
  toggle: (id: Transaction) => ({
    type: ACTIONS.TOGGLE,
    payload: id,
  }),
  clear: () => ({
    type: ACTIONS.CLEAR,
  }),
};

const initialState = [];

export default ((state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.TOGGLE:
      // credit card currently only support single selection
      const newItem = action.payload;
      const isPresent = _.get(state, '0.id') === newItem.id;
      return isPresent ? [] : [newItem];
    case ACTIONS.CLEAR:
      return initialState;
    default:
      return state;
  }
}) as Reducer<Transaction[], any>;
