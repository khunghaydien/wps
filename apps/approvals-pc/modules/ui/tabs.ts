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
  ATT_MONTHLY: 'ATT_MONTHLY',
  TRACKING: 'TRACKING',
  EXPENSES: 'EXPENSES',
  EXP_PRE_APPROVAL: 'EXP_PRE_APPROVAL',
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
