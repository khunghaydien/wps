import { Reducer } from 'redux';

const ACTIONS = {
  SET_SUCCESS: 'MODULES/UI/SELECTED_RECORD_TYPE_ID/SET',
};

export const actions = {
  set: (id: string) => ({
    type: ACTIONS.SET_SUCCESS,
    payload: id,
  }),
};

const initialState = '';

export default ((state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.SET_SUCCESS:
      return action.payload;
    default:
      return state;
  }
}) as Reducer<string, any>;
