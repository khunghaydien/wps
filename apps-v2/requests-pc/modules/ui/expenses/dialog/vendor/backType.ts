import { Reducer } from 'redux';

import { VendorBackType } from '@apps/domain/models/exp/Vendor';

export const ACTIONS = {
  SET: 'MODULES/UI/EXPENSES/DIALOG/VENDOR/BACK_TYPE/SET',
  CLEAR: 'MODULES/UI/EXPENSES/DIALOG/VENDOR/BACK_TYPE/CLEAR',
};

export const actions = {
  set: (type: VendorBackType) => ({
    type: ACTIONS.SET,
    payload: type,
  }),
  clear: () => ({
    type: ACTIONS.CLEAR,
  }),
};

//
// Reducer
//
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
}) as Reducer<VendorBackType, any>;
