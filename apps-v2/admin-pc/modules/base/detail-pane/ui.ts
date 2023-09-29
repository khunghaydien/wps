import { Reducer } from 'redux';

import { CHANGE_COMPANY } from '../menu-pane/ui';

export const MODE = {
  VIEW: '',
  NEW: 'new',
  EDIT: 'edit',
  REVISION: 'revision',
  CLONE: 'clone',
  CUSTOM: 'custom',
  ADD_SUB_ROLE: 'add_sub_role',
} as const;

export const INITIALIZE = 'MODULES/BASE/DETAIL_PANE/UI/INITIALIZE';
export const SHOW_DETAIL_PANE = 'MODULES/BASE/DETAIL_PANE/UI/SHOW_DETAIL_PANE';
export const SHOW_REVISION_DIALOG_PANE =
  'MODULES/BASE/DETAIL_PANE/UI/SHOW_REVISION_DIALOG_PANE';
export const SET_MODE_BASE = 'MODULES/BASE/DETAIL_PANE/UI/SET_MODE_BASE';
export const SET_MODE_HISTORY =
  'MODULES/HISTORY/DETAIL_PANE/UI/SET_MODE_HISTORY';

export type State = {
  readonly isShowDetail: boolean | null | undefined;
  readonly isShowRevisionDialog: boolean | null | undefined;
  readonly modeBase: string | null | undefined;
  readonly modeHistory: string | null | undefined;
};

export const initializeDetailPane = () => ({
  type: INITIALIZE,
});

export const showDetailPane = (show: boolean) => ({
  type: SHOW_DETAIL_PANE,
  payload: show,
});

export const showRevisionDialog = (show: boolean) => ({
  type: SHOW_REVISION_DIALOG_PANE,
  payload: show,
});

export const setModeBase = (mode: string) => ({
  type: SET_MODE_BASE,
  payload: mode,
});

export const setModeHistory = (mode: string) => ({
  type: SET_MODE_HISTORY,
  payload: mode,
});

export const initialState: State = {
  isShowDetail: false,
  isShowRevisionDialog: false,
  modeBase: '',
  modeHistory: '',
};

export default ((state = initialState, action) => {
  switch (action.type) {
    case INITIALIZE:
    case CHANGE_COMPANY:
      return initialState;
    case SHOW_DETAIL_PANE:
      return {
        ...state,
        isShowDetail: action.payload,
      };
    case SHOW_REVISION_DIALOG_PANE:
      return {
        ...state,
        isShowRevisionDialog: action.payload,
      };
    case SET_MODE_BASE:
      return {
        ...state,
        modeBase: action.payload,
      };
    case SET_MODE_HISTORY:
      return {
        ...state,
        modeHistory: action.payload,
      };
    default:
      return state;
  }
}) as Reducer<State, any>;
