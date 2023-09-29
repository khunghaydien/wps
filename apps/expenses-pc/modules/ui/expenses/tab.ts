import { Reducer } from 'redux';

//
// constants
//
const ACTIONS = {
  SET_ACTIVE: 'MODULES/UI/TAB/SET_ACTIVE',
  SET_APPROVED: 'MODULES/UI/TAB/SET_APPROVED',
};
//
// actions
//
export const actions = {
  setActive: () => ({
    type: ACTIONS.SET_ACTIVE,
  }),
  changeTab: (tabIdx: number) => ({
    type: tabIdx ? ACTIONS.SET_APPROVED : ACTIONS.SET_ACTIVE,
  }),
};

//
// Reducer
//
const initialState = 0;

export default ((state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.SET_ACTIVE:
      return 0;
    case ACTIONS.SET_APPROVED:
      return 1;
    default:
      return state;
  }
}) as Reducer<number, any>;
