import { Reducer } from 'redux';

import { VendorItemList } from '../../../../../../domain/models/exp/Vendor';

export const ACTIONS = {
  SET: 'MODULES/EXPENSES/DIALOG/VENDOR/RECENTLY_USED/SET',
  CLEAR: 'MODULES/EXPENSES/DIALOG/VENDOR/RECENTLY_USED/CLEAR',
};

export const actions = {
  set: (item: VendorItemList) => ({
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
  records: [],
  hasMore: false,
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
}) as Reducer<VendorItemList, any>;
