type State = {
  targetDate: string;
};

const initialState: State = {
  targetDate: '',
};

// Actions
const ActionType = {
  INIT: 'ADMIN-PC/MODULES/LEGAL_AGREEMENT/UI/SEARCH_CONDITION/INITIALIZE',
  SET: 'ADMIN-PC/MODULES/LEGAL_AGREEMENT/UI/SEARCH_CONDITION/SET',
};

type Initialize = {
  type: typeof ActionType.INIT;
  payload?: State;
};

type Set = {
  type: typeof ActionType.SET;
  payload: {
    key: keyof State;
    value: string;
  };
};

type Action = Initialize | Set;

export const actions = {
  initialize: (values?: State) => ({
    type: ActionType.INIT,
    payload: values,
  }),
  set: (key: keyof State, value: string): Set => ({
    type: ActionType.SET,
    payload: {
      key,
      value,
    },
  }),
};

// Reducer
export default (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case ActionType.INIT:
      return (action as Initialize).payload || initialState;
    case ActionType.SET: {
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
