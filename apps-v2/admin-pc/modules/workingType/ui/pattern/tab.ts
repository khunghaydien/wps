import ROOT from './actionType';

export const OPTION_VALUE = {
  ALL: 'all',
  CHOSEN: 'chosen',
} as const;

export type OptionValue = Value<typeof OPTION_VALUE>;

type State = {
  tabValue: OptionValue;
};

export const initialState: State = {
  tabValue: OPTION_VALUE.ALL,
};

// Actions
export const ACTION_TYPE = {
  SET: `${ROOT}/TAB/SET`,
  RESET: `${ROOT}/TAB/RESET`,
} as const;

type Set = {
  type: typeof ACTION_TYPE.SET;
  payload: OptionValue;
};

type Reset = {
  type: typeof ACTION_TYPE.RESET;
};

type Action = Set | Reset;

export const actions = {
  set: (value: OptionValue): Set => ({
    type: ACTION_TYPE.SET,
    payload: value,
  }),
  reset: (): Reset => ({
    type: ACTION_TYPE.RESET,
  }),
};

// Reducer

export default (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case ACTION_TYPE.SET: {
      return {
        ...state,
        tabValue: action.payload,
      };
    }

    case ACTION_TYPE.RESET:
      return initialState;

    default:
      return state;
  }
};
