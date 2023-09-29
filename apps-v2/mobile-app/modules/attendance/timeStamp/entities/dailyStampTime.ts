import { DailyStampTime } from '@attendance/domain/models/DailyStampTime';

export type State = DailyStampTime;

type Action = {
  type: string;
  payload?: any;
};

const ACTIONS = {
  SET: 'ATTENDANCE/TIME_STAMP/ENTITIES/DAILY_STAMP_TIME/SET',
  UNSET: 'ATTENDANCE/TIME_STAMP/ENTITIES/DAILY_STAMP_TIME/UNSET',
};

export const actions = {
  unset: (): Action => ({
    type: ACTIONS.UNSET,
  }),
  set: (dailyStampTime: DailyStampTime): Action => ({
    type: ACTIONS.SET,
    payload: dailyStampTime,
  }),
};

const initialState: State = {
  isEnableStartStamp: true,
  isEnableEndStamp: true,
  isEnableRestartStamp: false,
  stampInDate: '',
  stampOutDate: '',
  stampReInDate: '',
  defaultAction: 'in',
  commuteCount: null,
  isPossibleFixDailyRequest: false,
  record: null,
};

export default (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case ACTIONS.UNSET:
      return initialState;
    case ACTIONS.SET:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};
