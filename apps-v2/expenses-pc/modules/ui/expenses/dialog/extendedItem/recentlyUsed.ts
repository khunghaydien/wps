import { Reducer } from 'redux';

import { CustomEIOptionList } from '../../../../../../domain/models/exp/ExtendedItem';

export const ACTIONS = {
  SET: 'MODULES/EXPENSES/DIALOG/EI_LOOKUP/RECENTLY_USED/SET',
  CLEAR: 'MODULES/EXPENSES/DIALOG/EI_LOOKUP/RECENTLY_USED/CLEAR',
};

export const actions = {
  set: (item: CustomEIOptionList) => ({
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
}) as Reducer<CustomEIOptionList, any>;
