import { ApprovalHistory } from '../../../../../domain/models/approval/request/History';

type State = ApprovalHistory[];

const initialState: State = [];

// Actions

type Initialize = {
  type: 'MOBILE-APP/MODULES/ATTENDANCE/DAILYREQUEST/ENTITIES/APPROVAL_HISTORIES/INITIALIZE';
  payload: State;
};

type Action = Initialize;

const INITIALIZE: Initialize['type'] =
  'MOBILE-APP/MODULES/ATTENDANCE/DAILYREQUEST/ENTITIES/APPROVAL_HISTORIES/INITIALIZE';

export const actions = {
  initialize: (approvalHistories: ApprovalHistory[] = []) => ({
    type: INITIALIZE,
    payload: approvalHistories,
  }),
};

// Reducer

export default (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case INITIALIZE: {
      const { payload } = action;
      return [...payload];
    }

    default:
      return state;
  }
};
