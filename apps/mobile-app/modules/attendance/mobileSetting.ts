import { MobileSetting } from '@apps/domain/models/attendance/MobileSetting';

export type State = MobileSetting;

type Initialize = {
  type: 'ATTENDANCE/MOBILE_SETTING';
  payload: State;
};

const ACTIONS = {
  INITIALIZE: 'ATTENDANCE/MOBILE_SETTING',
} as const;

export const actions = {
  initialize: (state: State): Initialize => ({
    type: ACTIONS.INITIALIZE,
    payload: state,
  }),
};

const initialState: State = {
  requireLocationAtMobileStamp: false,
  useManageCommuteCountAtMobileStamp: false,
  defaultCommuteBackwardCount: null,
  defaultCommuteForwardCount: null,
};

type Action = Initialize;

export default (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case ACTIONS.INITIALIZE:
      return action.payload;
    default:
      return state;
  }
};
