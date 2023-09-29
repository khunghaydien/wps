import { Reducer } from 'redux';

import { EISearchObj } from '../../../../../../domain/models/exp/ExtendedItem';

export const ACTIONS = {
  SET: 'MODULES/EXPENSES/DIALOG/EI_LOOKUP/LIST/SET',
  CLEAR: 'MODULES/EXPENSES/DIALOG/EI_LOOKUP/LIST/CLEAR',
};

export const actions = {
  set: (item: EISearchObj) => ({
    type: ACTIONS.SET,
    payload: item,
  }),
  clear: () => ({
    type: ACTIONS.CLEAR,
  }),
};

//
// Reducer
//
const initialState = {
  extendedItemLookupId: null,
  extendedItemCustomId: null,
  name: null,
  idx: null,
  target: null,
  hintMsg: null,
};

export default ((state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.SET:
      return action.payload;
    case ACTIONS.CLEAR:
      return initialState;
    default:
      return state;
  }
}) as Reducer<EISearchObj, any>;
