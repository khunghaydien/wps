import { Reducer } from 'redux';

const ACTIONS = {
  SET: 'MODULES/UI/EXPENSES/DETAIL/RECORD_AREA/SELECTED_RECORD/SET',
};

/** Define actions */
export const actions = {
  set: (idx: number) => ({
    type: ACTIONS.SET,
    payload: idx,
  }),
};

const initialState = null;

export default ((state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.SET:
      return action.payload;
    default:
      return state;
  }
}) as Reducer<number | null | undefined, any>;
