// State

type State = {
  enabled: boolean;
};

const initialState: State = { enabled: false };

// Actions
export const ActionType = {
  ENABLE: '/TIME-TRACKING/AUTO-HOURS-ALLOCATE-RESULT-DIALOG/UI/BLOCKING/ENABLE',
  DISABLE:
    '/TIME-TRACKING/AUTO-HOURS-ALLOCATE-RESULT-DIALOG/UI/BLOCKING/DISABLE',
} as const;

type Enable = {
  type: typeof ActionType.ENABLE;
};

type Disable = {
  type: typeof ActionType.DISABLE;
};

type Action = Enable | Disable;

export const actions = {
  enable: (): Enable => ({
    type: ActionType.ENABLE,
  }),

  disable: (): Disable => ({
    type: ActionType.DISABLE,
  }),
};

// Reducer

export default (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case ActionType.ENABLE: {
      return {
        ...state,
        enabled: true,
      };
    }

    case ActionType.DISABLE: {
      return {
        ...state,
        enabled: false,
      };
    }

    default:
      return state;
  }
};
