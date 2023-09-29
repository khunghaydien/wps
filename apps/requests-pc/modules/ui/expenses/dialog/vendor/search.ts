import { Reducer } from 'redux';

import {
  initialVendor,
  VendorItem,
} from '../../../../../../domain/models/exp/Vendor';

export const ACTIONS = {
  SET: 'MODULES/EXPENSES/DIALOG/VENDOR/LIST/SET',
  CLEAR: 'MODULES/EXPENSES/DIALOG/VENDOR/LIST/CLEAR',
};

export const actions = {
  set: (item: VendorItem) => ({
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
const initialState = initialVendor;

export default ((state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.SET:
      return action.payload;
    case ACTIONS.CLEAR:
      return initialState;
    default:
      return state;
  }
}) as Reducer<VendorItem, any>;
