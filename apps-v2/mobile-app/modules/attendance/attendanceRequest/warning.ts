import ROOT from './actionType';

type State = {
  messages: string[] | null;
  callback: (answer: boolean) => void;
};

const ACTION_TYPE_ROOT = `${ROOT}/WARNING` as const;

const ACTION_TYPES = {
  SET_MESSAGES: `${ACTION_TYPE_ROOT}/SET_MESSAGES`,
  CLEAR: `${ACTION_TYPE_ROOT}/CLEAR`,
} as const;

type ActionTypes = typeof ACTION_TYPES;

type SetMessagesAction = {
  type: ActionTypes['SET_MESSAGES'];
  payload: State;
};

type ClearAction = {
  type: ActionTypes['CLEAR'];
};

type Actions = SetMessagesAction | ClearAction;

export const actions = {
  setMessages: (
    messages: State['messages'],
    callback: State['callback']
  ): SetMessagesAction => ({
    type: ACTION_TYPES.SET_MESSAGES,
    payload: {
      messages,
      callback,
    },
  }),
  clear: (): ClearAction => ({
    type: ACTION_TYPES.CLEAR,
  }),
};

const initialState: State = {
  messages: null,
  callback: (_: boolean) => {},
};

export default (state: State = initialState, action: Actions): State => {
  const { type } = action;
  switch (type) {
    case ACTION_TYPES.SET_MESSAGES: {
      const { payload } = action;
      return payload;
    }
    case ACTION_TYPES.CLEAR:
      return initialState;
    default:
      return state;
  }
};
