import ROOT from './actionType';

type State = {
  current: number;
  limit: number;
  limitPerPage: number;
  isOverLimit: boolean;
};

export const initialState: State = {
  current: 0,
  limit: 5000,
  limitPerPage: 100,
  isOverLimit: false,
};

// Actions

export const ACTION_TYPE = {
  INIT: `${ROOT}/PAGING/INITIALIZE`,
  SET_CURRENT: `${ROOT}/PAGING/SET_CURRRENT`,
  RESET: `${ROOT}/PAGING/RESET`,
} as const;

type Initialize = {
  type: typeof ACTION_TYPE.INIT;
  payload: State;
};

type SetCurrent = {
  type: typeof ACTION_TYPE.SET_CURRENT;
  payload: number;
};

type Reset = { type: typeof ACTION_TYPE.RESET };

type Action = Initialize | SetCurrent | Reset;

export const actions = {
  initialize: (param: State): Initialize => ({
    type: ACTION_TYPE.INIT,
    payload: param,
  }),
  setCurrent: (current: number): SetCurrent => ({
    type: ACTION_TYPE.SET_CURRENT,
    payload: current,
  }),
  reset: (): Reset => ({ type: ACTION_TYPE.RESET }),
};

// Reducer

export default (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case ACTION_TYPE.INIT:
      return action.payload;

    case ACTION_TYPE.SET_CURRENT:
      return {
        ...state,
        current: action.payload,
      };

    case ACTION_TYPE.RESET:
      return initialState;

    default:
      return state;
  }
};
