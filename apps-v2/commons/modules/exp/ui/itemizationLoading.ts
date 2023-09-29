import { Reducer } from 'redux';

export const ACTIONS = {
  TOGGLE: 'MODULES/EXP/UI/ITEMIZATION_LOADING/TOGGLE',
} as const;

type Actions = {
  type: typeof ACTIONS['TOGGLE'];
  payload: boolean;
};

export const actions = {
  toggle: (isLoading: boolean) => ({
    type: ACTIONS.TOGGLE,
    payload: isLoading,
  }),
};

const initialState = false;

export default ((state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.TOGGLE:
      return action.payload;
    default:
      return state;
  }
}) as Reducer<boolean, Actions>;
