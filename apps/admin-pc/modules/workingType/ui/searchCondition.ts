export type State = {
  targetDate: string;
};

export const initialState: State = {
  targetDate: '',
};

// Actions

type Initialize = {
  type: 'ADMIN-PC/MODULES/WORKING_TYPE/UI/SEARCH_CONDITION/INITIALIZE';
  payload?: State;
};

type Set = {
  type: 'ADMIN-PC/MODULES/WORKING_TYPE/UI/SEARCH_CONDITION/SET';
  payload: {
    key: keyof State;
    value: string;
  };
};

type Action = Initialize | Set;

export const INITIALIZE: Initialize['type'] =
  'ADMIN-PC/MODULES/WORKING_TYPE/UI/SEARCH_CONDITION/INITIALIZE';

export const SET: Set['type'] =
  'ADMIN-PC/MODULES/WORKING_TYPE/UI/SEARCH_CONDITION/SET';

export const actions = {
  initialize: (values?: State) => ({
    type: INITIALIZE,
    payload: values,
  }),
  set: (key: keyof State, value: string): Set => ({
    type: SET,
    payload: {
      key,
      value,
    },
  }),
};

// Reducer

export default (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case INITIALIZE:
      return action.payload || initialState;
    case SET: {
      const { key, value } = action.payload;
      return {
        ...state,
        [key]: value,
      };
    }

    default:
      return state;
  }
};
