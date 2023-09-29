// State

type State = {
  enabled: boolean;
};

const initialState: State = {
  enabled: false,
};

// Actions

type Enable = {
  type: 'COMMONS/MODULES/STANDALONEMODE/ENABLE';
};

type Disable = {
  type: 'COMMONS/MODULES/STANDALONEMODE/DISABLE';
};

type Action = Enable | Disable;

const ENABLE = 'COMMONS/MODULES/STANDALONEMODE/ENABLE';
const DISABLE = 'COMMONS/MODULES/STANDALONEMODE/DISABLE';

export const actions = {
  enable: (): Enable => ({
    type: ENABLE,
  }),

  disable: (): Disable => ({
    type: DISABLE,
  }),
};

// Reducer

export default function reducer(
  state: State = initialState,
  action: Action
): State {
  switch (action.type) {
    case ENABLE:
      return {
        ...state,
        enabled: true,
      };

    case DISABLE:
      return {
        ...state,
        enabled: false,
      };

    default:
      return state;
  }
}
