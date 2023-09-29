type State = {
  selectedCode: string;
};

const initialState: State = {
  selectedCode: '',
};

// Actions
const ActionType = {
  INIT: 'ADMIN-PC/MODULES/LEGAL_AGREEMENT/UI/LIST/INITIALIZE',
  SET_SELECTED_CODE:
    'ADMIN-PC/MODULES/LEGAL_AGREEMENT/UI/LIST/SET_SELECTED_CODE',
  RESET_SELECTED_CODE:
    'ADMIN-PC/MODULES/LEGAL_AGREEMENT/UI/LIST/RESET_SELECTED_CODE',
};

type Initialize = {
  type: typeof ActionType.INIT;
};

type SetSelectedIndex = {
  type: typeof ActionType.SET_SELECTED_CODE;
  payload: string;
};

type ResetSelectedIndex = {
  type: typeof ActionType.RESET_SELECTED_CODE;
};

type Action = Initialize | SetSelectedIndex | ResetSelectedIndex;

export const actions = {
  initialize: (): Initialize => ({
    type: ActionType.INIT,
  }),
  setSelectedCode: (selectedCode: string): SetSelectedIndex => ({
    type: ActionType.SET_SELECTED_CODE,
    payload: selectedCode,
  }),
  resetSelectedCode: (): ResetSelectedIndex => ({
    type: ActionType.RESET_SELECTED_CODE,
  }),
};

// Reducer
export default (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case ActionType.INIT: {
      return initialState;
    }
    case ActionType.SET_SELECTED_CODE: {
      return {
        ...state,
        selectedCode: (action as SetSelectedIndex).payload,
      };
    }
    case ActionType.RESET_SELECTED_CODE: {
      return {
        ...state,
        selectedCode: '',
      };
    }
    default:
      return state;
  }
};
