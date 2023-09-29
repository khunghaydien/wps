export type State = {
  selectedCode: string;
};

export const initialState: State = {
  selectedCode: '',
};

// Actions

type Initialize = {
  type: 'ADMIN-PC/MODULES/WORKING_TYPE/UI/LIST/INITIALIZE';
};

type SetSelectedIndex = {
  type: 'ADMIN-PC/MODULES/WORKING_TYPE/UI/LIST/SET_SELECTED_CODE';
  payload: string;
};

type ResetSelectedIndex = {
  type: 'ADMIN-PC/MODULES/WORKING_TYPE/UI/LIST/RESET_SELECTED_CODE';
};

type Action = Initialize | SetSelectedIndex | ResetSelectedIndex;

export const INITIALIZE: Initialize['type'] =
  'ADMIN-PC/MODULES/WORKING_TYPE/UI/LIST/INITIALIZE';

export const SET_SELECTED_CODE: SetSelectedIndex['type'] =
  'ADMIN-PC/MODULES/WORKING_TYPE/UI/LIST/SET_SELECTED_CODE';

export const RESET_SELECTED_CODE: ResetSelectedIndex['type'] =
  'ADMIN-PC/MODULES/WORKING_TYPE/UI/LIST/RESET_SELECTED_CODE';

export const actions = {
  initialize: (): Initialize => ({
    type: INITIALIZE,
  }),
  setSelectedIndex: (selectedCode: string): SetSelectedIndex => ({
    type: SET_SELECTED_CODE,
    payload: selectedCode,
  }),
  resetSelectedIndex: (): ResetSelectedIndex => ({
    type: RESET_SELECTED_CODE,
  }),
};

// Reducer

export default (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case INITIALIZE: {
      return initialState;
    }

    case SET_SELECTED_CODE: {
      return {
        ...state,
        selectedCode: action.payload,
      };
    }

    case RESET_SELECTED_CODE: {
      return {
        ...state,
        selectedCode: '',
      };
    }

    default:
      return state;
  }
};
