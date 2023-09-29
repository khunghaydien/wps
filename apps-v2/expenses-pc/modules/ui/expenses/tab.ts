import { Reducer } from 'redux';

//
// constants
//
const ACTIONS = {
  SET_ACTIVE: 'MODULES/UI/TAB/SET_ACTIVE',
  SET_ACTIVE_TAB: 'MODULES/UI/TAB/SET_ACTIVE_TAB',
  SET_SELECTED_COMPANY: 'MODULES/UI/TAB/SET_SELECTED_COMPANY',
};
//
// actions
//
export const actions = {
  setActive: () => ({
    type: ACTIONS.SET_ACTIVE,
  }),
  changeTab: (tabIdx: number) => ({
    type: ACTIONS.SET_ACTIVE_TAB,
    data: tabIdx,
  }),
  setCompanyId: (companyId: string | null, isApproval?: boolean) => ({
    type: ACTIONS.SET_SELECTED_COMPANY,
    data: { companyId, isApproval },
  }),
};

type State = { companyId: string | null; isApproval?: boolean; tabIdx: number };
//
// Reducer
//
const initialState: State = {
  tabIdx: 0,
  companyId: null,
  isApproval: false,
};

export default ((state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.SET_ACTIVE:
      return { ...state, tabIdx: 0 };
    case ACTIONS.SET_ACTIVE_TAB:
      return { ...state, tabIdx: action.data };
    case ACTIONS.SET_SELECTED_COMPANY:
      return {
        ...state,
        companyId: action.data.companyId,
        isApproval: action.data.isApproval,
      };
    default:
      return state;
  }
}) as Reducer<State, any>;
