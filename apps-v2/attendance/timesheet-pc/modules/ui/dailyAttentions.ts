type State = {
  messages: Array<string>;
};

const ACTIONS = {
  SET: 'TIMESHEET-PC/UI/DAILY_WARNING_TIME/SET',
  UNSET: 'TIMESHEET-PC/UI/DAILY_WARNING_TIME/UNSET',
} as const;

type SetAction = {
  type: typeof ACTIONS['SET'];
  payload?: State['messages'];
};

type UnsetAction = {
  type: typeof ACTIONS['UNSET'];
};

type Action = SetAction | UnsetAction;

export const actions = {
  set: (messages: State['messages']): SetAction => ({
    type: ACTIONS.SET,
    payload: messages,
  }),
  unset: (): UnsetAction => ({
    type: ACTIONS.UNSET,
  }),
};

const initialState: State = {
  messages: [],
};

export default function reducer(
  state: State = initialState,
  action: Action
): State {
  switch (action.type) {
    case ACTIONS.SET:
      return {
        messages: action.payload,
      };
    case ACTIONS.UNSET:
      return {
        messages: [],
      };
    default:
      return state;
  }
}
