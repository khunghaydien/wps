// State

type State = {
  enabled: false;
};

const initialState: State = { enabled: false };

// Actions

type Enable = {
  type: '/TIME_TRACKING/TRACK_SUMMARY/UI/BLOCKING/ENABLE';
};

type Disable = {
  type: '/TIME_TRACKING/TRACK_SUMMARY/UI/BLOCKING/DISABLE';
};

type Action = Enable | Disable;

const ENABLE = '/TIME_TRACKING/TRACK_SUMMARY/UI/BLOCKING/ENABLE';
const DISABLE = '/TIME_TRACKING/TRACK_SUMMARY/UI/BLOCKING/DISABLE';

export const actions = {
  enable: (): Enable => ({
    type: ENABLE,
  }),

  disable: (): Disable => ({
    type: DISABLE,
  }),
};

// Reducer

export default (state: State = initialState, action: Action) => {
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
