export type State = {
  targetDate: string;
};

export const initialState: State = {
  targetDate: '',
};
const actionName = 'ADMIN-PC/MODULES/FEATURE-SETTING/UI/SEARCH_CONDITION/';
// Actions
export const ACTION_TYPE = {
  INIT: actionName + 'INITIALIZE',
  SET: actionName + 'SET',
};

type Initialize = {
  type: typeof ACTION_TYPE.INIT;
  payload?: State;
};

type Set = {
  type: typeof ACTION_TYPE.SET;
  payload: {
    key: keyof State;
    value: string;
  };
};

type Action = Initialize | Set;

export const INITIALIZE: Initialize['type'] = ACTION_TYPE.INIT;

export const SET: Set['type'] = ACTION_TYPE.SET;

export const actions = {
  initialize: (values?: State) => ({
    type: ACTION_TYPE.INIT,
    payload: values,
  }),
  set: (key: keyof State, value: string): Set => ({
    type: ACTION_TYPE.SET,
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
      return (action as Initialize).payload || initialState;
    case SET: {
      const { key, value } = (action as Set).payload;
      return {
        ...state,
        [key]: value,
      };
    }

    default:
      return state;
  }
};
