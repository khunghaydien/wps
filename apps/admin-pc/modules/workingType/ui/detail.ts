export type State = {
  selectedHistoryId: string;
  selectedIndex?: number;
};

export const initialState: State = {
  selectedHistoryId: '',
};

// Actions

type Initialize = {
  type: 'ADMIN-PC/MODULES/WORKING_TYPE/UI/DETAIL/INITIALIZE';
};

type SetSelectedHistoryId = {
  type: 'ADMIN-PC/MODULES/WORKING_TYPE/UI/DETAIL/SET_SELECTED_HISTORY_ID';
  payload: string;
};

type Action = Initialize | SetSelectedHistoryId;

export const INITIALIZE: Initialize['type'] =
  'ADMIN-PC/MODULES/WORKING_TYPE/UI/DETAIL/INITIALIZE';

export const SET_SELECTED_HISTORY_ID: SetSelectedHistoryId['type'] =
  'ADMIN-PC/MODULES/WORKING_TYPE/UI/DETAIL/SET_SELECTED_HISTORY_ID';

export const actions = {
  initialize: (): Initialize => ({
    type: INITIALIZE,
  }),
  setSelectedHistoryId: (value: string): SetSelectedHistoryId => ({
    type: SET_SELECTED_HISTORY_ID,
    payload: value,
  }),
};

// Reducer

export default (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case INITIALIZE: {
      return initialState;
    }

    case SET_SELECTED_HISTORY_ID: {
      return {
        ...state,
        selectedHistoryId: action.payload,
      };
    }

    default:
      return state;
  }
};
