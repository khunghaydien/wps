import { Reducer } from 'redux';

type State = number;

const ACTIONS = {
  SET_COMPANY_COUNT: 'MODULES/UI/COMPANY_COUNT/SET',
};

export const setCompanyCount = (count: number) => ({
  type: ACTIONS.SET_COMPANY_COUNT,
  payload: count,
});

const initialState = 0;

export default ((state: State = initialState, action) => {
  switch (action.type) {
    case ACTIONS.SET_COMPANY_COUNT:
      return action.payload;
    default:
      return state;
  }
}) as Reducer<State, any>;
