import { Reducer } from 'redux';

const ACTIONS = {
  SET_SELECTED_COMPANY:
    'MODULES/UI/FINANCE_APPROVAL/COMPANY_SWITCH/SET_SELECTED_COMPANY',
};

export const setCompanyId = (id: string) => ({
  type: ACTIONS.SET_SELECTED_COMPANY,
  payload: id,
});

type State = string | null;
const initialState = null;

export default ((state: State = initialState, action) => {
  switch (action.type) {
    case ACTIONS.SET_SELECTED_COMPANY:
      return action.payload;
    default:
      return state;
  }
}) as Reducer<State, any>;
