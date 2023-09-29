export type State = {
  selectedCode: string;
};

export const initialState: State = {
  selectedCode: '',
};

const actionName = 'ADMIN-PC/MODULES/FEATURE-SETTING/UI/LIST/' as const;

// Actions
export const ACTION_TYPE = {
  INIT: actionName + 'INITIALIZE',
  SET_SELECTED_INDEX: actionName + 'SET_SELECTED_CODE',
  RESET_SELECTED_INDEX: actionName + 'RESET_SELECTED_CODE',
} as const;

type Initialize = {
  type: typeof ACTION_TYPE.INIT;
};

type SetSelectedIndex = {
  type: typeof ACTION_TYPE.SET_SELECTED_INDEX;
  payload: string;
};

type ResetSelectedIndex = {
  type: typeof ACTION_TYPE.RESET_SELECTED_INDEX;
};

type Action = Initialize | SetSelectedIndex | ResetSelectedIndex;

export const actions = {
  initialize: (): Initialize => ({
    type: ACTION_TYPE.INIT,
  }),
  setSelectedCode: (selectedCode: string): SetSelectedIndex => ({
    type: ACTION_TYPE.SET_SELECTED_INDEX,
    payload: selectedCode,
  }),
  resetSelectedCode: (): ResetSelectedIndex => ({
    type: ACTION_TYPE.RESET_SELECTED_INDEX,
  }),
};

export default (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case ACTION_TYPE.INIT: {
      return initialState;
    }

    case ACTION_TYPE.SET_SELECTED_INDEX: {
      return {
        ...state,
        selectedCode: (action as SetSelectedIndex).payload,
      };
    }

    case ACTION_TYPE.RESET_SELECTED_INDEX: {
      return {
        ...state,
        selectedCode: '',
      };
    }

    default:
      return state;
  }
};
