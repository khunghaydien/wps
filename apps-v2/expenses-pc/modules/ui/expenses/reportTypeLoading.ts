import { Reducer } from 'redux';

export const ACTIONS = {
  SET_LOADING: 'MODULES/UI/EXP/EXP_REPORT_TYPE/SET_LOADING',
};

export const set = (loading: boolean) => ({
  type: ACTIONS.SET_LOADING,
  payload: loading,
});

const initialState = false;

export default ((state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.SET_LOADING:
      return action.payload;
    default:
      return state;
  }
}) as Reducer<boolean, any>;
