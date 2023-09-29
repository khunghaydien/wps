import {
  ACTIONS_FOR_FIX,
  AttFixSummaryRequest,
  detectPerformableActionForFix,
  STATUS,
} from '@attendance/domain/models/AttFixSummaryRequest';
import { Timesheet } from '@attendance/domain/models/Timesheet';

import ROOT from './actionType';

type State = AttFixSummaryRequest;

const ACTION_TYPE_ROOT = `${ROOT}/REQUEST` as const;

const ACTION_TYPES = {
  INITIALIZE: `${ACTION_TYPE_ROOT}/INITIALIZE`,
  SET_COMMENT: `${ACTION_TYPE_ROOT}/SET_COMMENT`,
  UNSET_COMMENT: `${ACTION_TYPE_ROOT}/UNSET_COMMENT`,
  CLEAR: `${ACTION_TYPE_ROOT}/CLEAR`,
} as const;

type ActionTypes = typeof ACTION_TYPES;

type InitializeAction = {
  type: ActionTypes['INITIALIZE'];
  payload: Timesheet;
};

type SetCommentAction = {
  type: ActionTypes['SET_COMMENT'];
  payload: string;
};

type UnsetCommentAction = {
  type: ActionTypes['UNSET_COMMENT'];
};

type ClearAction = {
  type: ActionTypes['CLEAR'];
};

type Actions =
  | InitializeAction
  | SetCommentAction
  | UnsetCommentAction
  | ClearAction;

export const actions = {
  initialize: (timesheet: Timesheet): InitializeAction => ({
    type: ACTION_TYPES.INITIALIZE,
    payload: timesheet,
  }),
  setComment: (comment: string): SetCommentAction => ({
    type: ACTION_TYPES.SET_COMMENT,
    payload: comment,
  }),
  unsetComment: (): UnsetCommentAction => ({
    type: ACTION_TYPES.UNSET_COMMENT,
  }),
  clear: (): ClearAction => ({
    type: ACTION_TYPES.CLEAR,
  }),
};

const initialState = {
  summaryId: '',
  requestId: '',
  status: STATUS.NOT_REQUESTED,
  comment: '',
  performableActionForFix: ACTIONS_FOR_FIX.None,
};

export default (state: State = initialState, action: Actions): State => {
  const { type } = action;
  switch (type) {
    case ACTION_TYPES.INITIALIZE: {
      const { payload } = action;
      return {
        summaryId: payload.id,
        requestId: payload.requestId,
        status: payload.status,
        comment: '',
        performableActionForFix: detectPerformableActionForFix(payload.status),
      };
    }
    case ACTION_TYPES.SET_COMMENT: {
      const { payload } = action;
      return {
        ...state,
        comment: payload,
      };
    }
    case ACTION_TYPES.UNSET_COMMENT:
      return {
        ...state,
        comment: '',
      };
    case ACTION_TYPES.CLEAR:
      return initialState;
    default:
      return state;
  }
};
