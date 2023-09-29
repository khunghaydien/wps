export type State = {
  selectedRowIndex: number;
};

export const initialState: State = {
  selectedRowIndex: -1,
};

// Actions

type SetSelectedHistoryId = {
  type: 'ADMIN-PC/MODULES/BASE/LIST_PANE/UI/LIST/SET_SELECTED_ROW_INDEX';
  payload: number;
};

type Action = SetSelectedHistoryId;

export const SET_SELECTED_ROW_INDEX: SetSelectedHistoryId['type'] =
  'ADMIN-PC/MODULES/BASE/LIST_PANE/UI/LIST/SET_SELECTED_ROW_INDEX';

export const actions = {
  setSelectedRowIndex: (value: number): SetSelectedHistoryId => ({
    type: SET_SELECTED_ROW_INDEX,
    payload: value,
  }),
};

// Reducer

export default (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case SET_SELECTED_ROW_INDEX: {
      return {
        ...state,
        selectedRowIndex: action.payload,
      };
    }

    default:
      return state;
  }
};
