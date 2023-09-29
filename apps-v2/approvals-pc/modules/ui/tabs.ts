//
// constants
//
const SELECT = 'MODULES/UI/TABS/SELECT';

export const constants = {
  SELECT,
};

export const tabType = {
  UNAVAILABLE: 'UNAVAILABLE',
  ATT_DAILY: 'ATT_DAILY',
  ATT_FIX_MONTHLY: 'ATT_FIX_MONTHLY',
  ATT_FIX_DAILY: 'ATT_FIX_DAILY',
  ATT_LEGAL_AGREEMENT: 'ATT_LEGAL_AGREEMENT',
  TRACKING: 'TRACKING',
  EXPENSES: 'EXPENSES',
  EXP_PRE_APPROVAL: 'EXP_PRE_APPROVAL',
  CUSTOM_REQUEST: 'CUSTOM_REQUEST',
};

//
// actions
//
export const selectTab = (id) => {
  return {
    type: SELECT,
    payload: id,
  };
};

//
// Reducer
//
const initialState = {
  selected: '',
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SELECT:
      return { selected: action.payload };
    default:
      return state;
  }
};
