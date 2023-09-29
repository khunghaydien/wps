// State

type State = {
  isOpen: boolean;
  isOpenHistoryDialog: boolean;
  comment: string;
};

export const initialState = {
  comment: '',
  isOpen: false,
  isOpenHistoryDialog: false,
};

// Action

type Update = {
  type: '/TRACK_SUMMARY/UI/REQUEST/UPDATE';
  payload: Partial<State>;
};

type Reset = {
  type: '/TRACK_SUMMARY/UI/REQUEST/RESET';
};

type Action = Update | Reset;

const UPDATE = '/TRACK_SUMMARY/UI/REQUEST/UPDATE';
const RESET = '/TRACK_SUMMARY/UI/REQUEST/RESET';

export const actions = {
  update: (state: Partial<State>): Update => ({
    type: UPDATE,
    payload: state,
  }),
  reset: (): Reset => ({
    type: RESET,
  }),
};

// Reducer

export default (state: State = initialState, action: Action) => {
  switch (action.type) {
    case UPDATE: {
      return { ...state, ...action.payload };
    }
    case RESET: {
      return initialState;
    }
    default:
      return state;
  }
};
