import { createSelector } from 'reselect';

import {
  CATCH_API_ERROR,
  CATCH_BUSINESS_ERROR,
  CATCH_UNEXPECTED_ERROR,
  catchApiError,
  CatchApiErrorAction,
  CatchBusinessErrorAction,
  CatchUnexpectedErrorAction,
  CLEAR_ERROR,
  clearError,
  ClearErrorAction,
  confirm,
  ConfirmDialogAction,
  ConfirmDialogActionType,
  ConfirmDialogOpenAction,
  LOADING_END,
  LOADING_START,
  loadingEnd,
  LoadingEndAction,
  loadingStart,
  LoadingStartAction,
} from '../../actions/app';

import BusinessError from '../../errors/BusinessError';
import { ErrorInfo } from '../../errors/ErrorInfo';

/** Define constants */

export const constants = {
  LOADING_START,
  LOADING_END,
  CATCH_API_ERROR,
  CLEAR_ERROR,
};

/** Define actions */

/**
 * アクション
 */
type Action =
  | LoadingStartAction
  | LoadingEndAction
  | CatchApiErrorAction
  | CatchUnexpectedErrorAction
  | CatchBusinessErrorAction
  | ClearErrorAction
  | ConfirmDialogAction;

export const actions = {
  loadingStart,
  loadingEnd,
  catchApiError,
  clearError,
  confirm,
};

/** Define selectors */

const getLoadingDepth = (state) => state.common.app.loadingDepth;
const getLoadingArea = (state) => state.common.app.loadingAreas || [];

const loadingSelector = createSelector(
  getLoadingDepth,
  (loadingDepth) => loadingDepth > 0
);

const loadingAreaSelector = createSelector(
  getLoadingArea,
  (loadingAreas) => loadingAreas.length > 0
);

export const selectors = { loadingSelector, loadingAreaSelector };

/** Define reducer */

type State = {
  loadingDepth: number;
  loadingHint: string;
  error: ErrorInfo | BusinessError | null;
  unexpectedError: Error | null;
  confirmDialog:
    | {
        message: string;
        callback: (arg0: boolean) => void;
      }
    | null
    | undefined;
  loadingAreas: string[];
};

const initialState: State = {
  loadingDepth: 0,
  loadingHint: '',
  error: null,
  unexpectedError: null,
  confirmDialog: null,
  loadingAreas: [],
};

/**
 * TODO Fix this
 * Loading spinner currently has loadingDepth as atomic state.
 */
export default (state: State = initialState, action: Action) => {
  switch (action.type) {
    case LOADING_START:
      const updateAreas = [...(state.loadingAreas || [])];
      const payload = action.payload || {};
      if (payload.areas) {
        updateAreas.push(payload.areas);
      }
      return {
        ...state,
        loadingDepth: state.loadingDepth + 1,
        loadingAreas: updateAreas,
        loadingHint: payload.loadingHint || state.loadingHint,
      };

    case LOADING_END:
      // Prevent negative loadingDepth in case someone accidentally call loadingStart without loadingEnd
      const updateArea = [...(state.loadingAreas || [])];
      if (action.payload) {
        const idx = updateArea.indexOf(action.payload);
        updateArea.splice(idx, 1);
      }
      const result = state.loadingDepth - 1;
      const loadingDepth = result < 0 ? 0 : result;
      return {
        ...state,
        loadingDepth,
        loadingAreas: updateArea,
        loadingHint: loadingDepth === 0 ? '' : state.loadingHint,
      };

    /** TODO: 表示形式（ダイアログ or ページ全体）が異なる場合も、同じ格納場所で良いか別途検討 */

    /** TODO：APIエラー以外のエラーも同等？ APIエラー以外の想定ができていないので方針保留 */
    case CATCH_API_ERROR:
      if (state.error && (state.error as ErrorInfo).isContinuable === false) {
        return state;
      } else {
        return {
          ...state,
          error: (action as CatchApiErrorAction).payload,
        };
      }

    case CATCH_UNEXPECTED_ERROR:
      return {
        ...state,
        unexpectedError: (action as CatchUnexpectedErrorAction).payload,
      };
    case CATCH_BUSINESS_ERROR:
      if (state.error && (state.error as ErrorInfo).isContinuable === false) {
        return state;
      } else {
        return {
          ...state,
          error: (action as CatchBusinessErrorAction).payload,
        };
      }

    case CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };

    case ConfirmDialogActionType.OPEN:
      return {
        ...state,
        confirmDialog: { ...(action as ConfirmDialogOpenAction).payload },
      };

    case ConfirmDialogActionType.CLOSE:
      return {
        ...state,
        confirmDialog: null,
      };

    default:
      return state;
  }
};
