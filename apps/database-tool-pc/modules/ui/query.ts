import { Reducer } from 'redux';

const SET_OPEN_DIALOG_STATUS =
  'MODULES/UI/DB_TOOL/QUERY/SET_OPEN_DIALOG_STATUS';
const SET_DELETE_DIALOG_STATUS =
  'MODULES/UI/DB_TOOL/QUERY/SET_DELETE_DIALOG_STATUS';
const SET_SELECTED_ID = 'MODULES/UI/DB_TOOL/QUERY/SET_SELECTED_ID';

export type State = {
  isSaveDialogOpen: boolean;
  isDeleteDialogOpen: boolean;
  selectedId: string;
};
export const setSaveDialog = (isOpen: boolean, name: string) => ({
  type: SET_OPEN_DIALOG_STATUS,
  payload: { isOpen, name },
});

export const setDeleteDialog = (isOpen: boolean) => ({
  type: SET_DELETE_DIALOG_STATUS,
  payload: isOpen,
});

export const setSelectedId = (id: string) => ({
  type: SET_SELECTED_ID,
  payload: id,
});

const initialState: State = {
  isSaveDialogOpen: false,
  isDeleteDialogOpen: false,
  selectedId: '',
};

export default ((state = initialState, action) => {
  switch (action.type) {
    case SET_OPEN_DIALOG_STATUS:
      return {
        ...state,
        isSaveDialogOpen: action.payload.isOpen,
      };
    case SET_DELETE_DIALOG_STATUS:
      return {
        ...state,
        isDeleteDialogOpen: action.payload,
      };
    case SET_SELECTED_ID:
      return { ...state, selectedId: action.payload };
    default:
      return state;
  }
}) as Reducer<State, any>;
