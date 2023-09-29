import { Reducer } from 'redux';

import { $Values } from 'utility-types';

export const LIST_TYPE = {
  Approved: 'approved',
  Active: 'active',
} as const;

export type ListType = $Values<typeof LIST_TYPE>;

export const ACTIONS = {
  SET: 'MODULES/EXPENSE/UI/REPORT/LIST_TYPE/SET',
  RESET: 'MODULES/EXPENSE/UI/REPORT/LIST_TYPE/RESET',
};

export const actions = {
  set: (listType: string) => ({
    type: ACTIONS.SET,
    payload: listType,
  }),
  clear: () => ({
    type: ACTIONS.RESET,
  }),
};

const initialState = LIST_TYPE.Active;

export default ((state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.SET:
      return action.payload;
    case ACTIONS.RESET:
    default:
      return state;
  }
}) as Reducer<ListType, any>;
