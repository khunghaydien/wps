import { defaultValue, User } from '../../../../domain/models/User';

// State

export type State = User;

export const initialState = defaultValue;

// Action

type Set = {
  type: '/DAILY-SUMMARY/ENTITIES/USER/SET';
  payload: {
    user: User;
  };
};

type Reset = {
  type: '/DAILY-SUMMARY/ENTITIES/USER/RESET';
};

export const SET = '/DAILY-SUMMARY/ENTITIES/USER/SET';
export const RESET = '/DAILY-SUMMARY/ENTITIES/USER/RESET';

type Action = Set | Reset;

export const actions = {
  set: (user: User): Set => ({
    type: SET,
    payload: { user },
  }),
  reset: (): Reset => ({
    type: RESET,
  }),
};

// Reducer

export default (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case SET: {
      return { ...action.payload.user };
    }
    case RESET: {
      return initialState;
    }
    default:
      return state;
  }
};
