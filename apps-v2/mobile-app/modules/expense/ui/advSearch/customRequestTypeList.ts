import { Reducer } from 'redux';

export const ACTIONS = {
  SET: 'MODULES/EXPENSE/UI/ADV_SEARCH/CUSTOM_REQUEST_TYPES/SET',
  CLEAR: 'MODULES/EXPENSE/UI/ADV_SEARCH/CUSTOM_REQUEST_TYPES/CLEAR',
};

type SetAction = {
  type: string;
  payload: string;
};

type ClearAction = {
  type: string;
};

export const actions = {
  set: (customRequestType: string): SetAction => ({
    type: ACTIONS.SET,
    payload: customRequestType,
  }),
  clear: (): ClearAction => ({
    type: ACTIONS.CLEAR,
  }),
};

type CustomRequestTypeList = Array<string>;

export const initialState = [] as CustomRequestTypeList;

export default ((state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.SET:
      return action.payload;
    case ACTIONS.CLEAR:
      return initialState;
    default:
      return state;
  }
}) as Reducer<CustomRequestTypeList, any>;
