import { Reducer } from 'redux';

import _ from 'lodash';

export const ACTIONS = {
  SET: 'COMMONS/EXP/UI/REPORT_LIST/ADV_SEARCH/VENDOR_IDS/SET',
  CLEAR: 'COMMONS/EXP/UI/REPORT_LIST/ADV_SEARCH/VENDOR_IDS/CLEAR',
  REPLACE: 'COMMONS/EXP/UI/REPORT_LIST/ADV_SEARCH/VENDOR_IDS/REPLACE',
};

type VendorIds = Array<string>;

export const actions = {
  set: (vendorId: string) => ({
    type: ACTIONS.SET,
    payload: vendorId,
  }),
  clear: () => ({
    type: ACTIONS.CLEAR,
  }),
  replace: (vendorIds: string[]) => ({
    type: ACTIONS.REPLACE,
    payload: vendorIds,
  }),
};

const initialState = [];

export default ((state: VendorIds = initialState, action) => {
  switch (action.type) {
    case ACTIONS.SET:
      const newVendorIds = [...state];
      const newItem = action.payload;

      if (!_.includes(state, newItem)) {
        newVendorIds.push(newItem);
      } else {
        _.pull(newVendorIds, newItem);
      }

      return newVendorIds;
    case ACTIONS.CLEAR:
      return initialState;
    case ACTIONS.REPLACE:
      return action.payload;
    default:
      return state;
  }
}) as Reducer<VendorIds, any>;
