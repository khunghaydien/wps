import ROOT from './actionType';

export type State = {
  selectedHistoryId: string;
  selectedIndex?: number;
};

export const initialState: State = {
  selectedHistoryId: '',
};

// Actions

export const ACTION_TYPE = {
  INIT: `${ROOT}/DETAIL/INITIALIZE`,
  SET_SELECTED_HISTORY_ID: `${ROOT}/DETAIL/SET_SELECTED_HISTORY_ID`,
} as const;

type Initialize = {
  type: typeof ACTION_TYPE.INIT;
};

type SetSelectedHistoryId = {
  type: typeof ACTION_TYPE.SET_SELECTED_HISTORY_ID;
  payload: string;
};

type Action = Initialize | SetSelectedHistoryId;

export const actions = {
  initialize: (): Initialize => ({
    type: ACTION_TYPE.INIT,
  }),
  setSelectedHistoryId: (value: string): SetSelectedHistoryId => ({
    type: ACTION_TYPE.SET_SELECTED_HISTORY_ID,
    payload: value,
  }),
};

// Reducer

export default (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case ACTION_TYPE.INIT: {
      return initialState;
    }

    case ACTION_TYPE.SET_SELECTED_HISTORY_ID: {
      return {
        ...state,
        selectedHistoryId: (action as SetSelectedHistoryId).payload,
      };
    }

    default:
      return state;
  }
};
