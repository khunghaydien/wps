// State

type State = {
  enabled: boolean;
};

const initialState: State = { enabled: false };

// Actions

type Enable = {
  type: '/DAILY-SUMMARY/UI/BLOCKING/ENABLE';
};

type Disable = {
  type: '/DAILY-SUMMARY/UI/BLOCKING/DISABLE';
};

type Action = Enable | Disable;

export const ENABLE = '/DAILY-SUMMARY/UI/BLOCKING/ENABLE';
export const DISABLE = '/DAILY-SUMMARY/UI/BLOCKING/DISABLE';

export const actions = {
  enable: (): Enable => ({
    type: ENABLE,
  }),

  disable: (): Disable => ({
    type: DISABLE,
  }),
};

// Reducer

export default (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case ENABLE: {
      return {
        ...state,
        enabled: true,
      };
    }

    case DISABLE: {
      return {
        ...state,
        enabled: false,
      };
    }

    default:
      return state;
  }
};
