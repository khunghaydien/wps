import { Reducer } from 'redux';

export const ACTIONS = {
  SET: 'MODULES/UI/SIDE_FILE_PREVIEW/SET',
  CLEAR: 'MODULES/UI/SIDE_FILE_PREVIEW/CLEAR',
};

export const actions = {
  set: (file: SideFile) => ({
    type: ACTIONS.SET,
    payload: file,
  }),
  clear: () => ({
    type: ACTIONS.CLEAR,
  }),
};

//
// Reducer
//
const initialState = {};

export type SideFile = {
  createdDate?: string;
  dataType?: string;
  id?: string;
  name?: string;
  verId?: string;
};

export default ((state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.SET:
      return action.payload;
    case ACTIONS.CLEAR:
      return initialState;
    default:
      return state;
  }
}) as Reducer<SideFile, any>;
