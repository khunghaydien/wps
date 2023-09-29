import { DailyStampTime } from '../../../domain/models/attendance/DailyStampTime';

export type State = Omit<DailyStampTime, 'defaultAction'>;

// Action

type Set = {
  type: 'TIMESTAMP_WIDGET/ENTITIES/DAILY_STAMP_TIME/SET';
  payload: State;
};

type UnSet = {
  type: 'TIMESTAMP_WIDGET/ENTITIES/DAILY_STAMP_TIME/UNSET';
};

type Action = Set | UnSet;

export const SET: Set['type'] =
  'TIMESTAMP_WIDGET/ENTITIES/DAILY_STAMP_TIME/SET';
export const UNSET: UnSet['type'] =
  'TIMESTAMP_WIDGET/ENTITIES/DAILY_STAMP_TIME/UNSET';

export const actions = {
  unset: () => ({
    type: UNSET,
  }),
  set: (dailyStampTime: State) => ({
    type: SET,
    payload: dailyStampTime,
  }),
};

export const initialState: State = {
  isEnableStartStamp: true,
  isEnableEndStamp: true,
  isEnableRestartStamp: false,
  commuteForwardCount: null,
  commuteBackwardCount: null,
};

export default (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case UNSET:
      return initialState;
    case SET:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};
