import { Reducer } from 'redux';

import _ from 'lodash';

import { IcTransaction } from '@apps/domain/models/exp/TransportICCard';

export const ACTIONS = {
  TOGGLE: 'MODULES/EXPENSE/UI/IC_CARD/SELECTED_TRANSACTIONS/TOGGLE',
  SET: 'MODULES/EXPENSE/UI/IC_CARD/SELECTED_TRANSACTIONS/SET',
  CLEAR: 'MODULES/EXPENSE/UI/IC_CARD/SELECTED_TRANSACTIONS/CLEAR',
};

export const actions = {
  toggle: (trans: IcTransaction) => ({
    type: ACTIONS.TOGGLE,
    payload: trans,
  }),
  set: (trans: IcTransaction) => ({
    type: ACTIONS.SET,
    payload: trans,
  }),
  clear: () => ({
    type: ACTIONS.CLEAR,
  }),
};

const initialState = [];

export default ((state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.TOGGLE:
      const newItem = action.payload;
      let newList = [...state];
      const selectedIds = newList.map((item) => item.recordId);
      if (selectedIds.indexOf(newItem.recordId) > -1) {
        newList = newList.filter(
          ({ recordId }) => recordId !== newItem.recordId
        );
      } else {
        newList.push(newItem);
      }
      return newList;
    case ACTIONS.SET:
      return [action.payload];
    case ACTIONS.CLEAR:
      return initialState;
    default:
      return state;
  }
}) as Reducer<IcTransaction[], any>;
