import { ApprovalHistory } from '@apps/domain/models/approval/request/History';

import ROOT from './actionType';

type State = ApprovalHistory[];

const ACTION_TYPE_ROOT = `${ROOT}/HISTORY` as const;

const ACTION_TYPES = {
  INITIALIZE: `${ACTION_TYPE_ROOT}/INITIALIZE`,
  CLEAR: `${ACTION_TYPE_ROOT}/CLEAR`,
} as const;

type ActionTypes = typeof ACTION_TYPES;

type InitializeAction = {
  type: ActionTypes['INITIALIZE'];
  payload: ApprovalHistory[];
};

type ClearAction = {
  type: ActionTypes['CLEAR'];
};

type Actions = InitializeAction | ClearAction;

export const actions = {
  initialize: (histories: ApprovalHistory[]): InitializeAction => ({
    type: ACTION_TYPES.INITIALIZE,
    payload: histories,
  }),
  clear: (): ClearAction => ({
    type: ACTION_TYPES.CLEAR,
  }),
};

const initialState: State = [];

export default (state: State = initialState, action: Actions): State => {
  const { type } = action;
  switch (type) {
    case ACTION_TYPES.INITIALIZE: {
      const { payload } = action;
      return payload;
    }
    case ACTION_TYPES.CLEAR:
      return initialState;
    default:
      return state;
  }
};
