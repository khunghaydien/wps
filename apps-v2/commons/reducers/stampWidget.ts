import {
  CLOCK_TYPE,
  ClockType,
  EditingDailyStampTime,
  STAMP_ACTION,
} from '../../domain/models/attendance/DailyStampTime';

import { ACTIONS as STAMP_WIDGET_ACTIONS } from '../actions/stampWidget';

type State = EditingDailyStampTime;

const initialState = {
  // NOTE: 打刻情報取得APIのレスポンス値を適用するまで、出退勤いずれも選択不可とする
  isEnableStartStamp: false,
  isEnableEndStamp: false,
  isEnableRestartStamp: false,
  mode: null,
  message: '',
};

type Action = {
  type: string;
  payload: any;
};

export default function reducer(state: State = initialState, action: Action) {
  switch (action.type) {
    case STAMP_WIDGET_ACTIONS.APPLY_DAILY_STAMP_TIME: {
      const {
        isEnableStartStamp,
        isEnableEndStamp,
        isEnableRestartStamp,
        defaultAction,
      } = action.payload;

      let mode = null;

      switch (defaultAction) {
        case STAMP_ACTION.IN:
          mode = isEnableStartStamp
            ? CLOCK_TYPE.CLOCK_IN
            : CLOCK_TYPE.CLOCK_REIN;
          break;
        case STAMP_ACTION.OUT:
          mode = CLOCK_TYPE.CLOCK_OUT;
          break;

        default:
          break;
      }

      return {
        ...state,
        isEnableStartStamp,
        isEnableEndStamp,
        isEnableRestartStamp,
        mode,
        message: '',
      };
    }

    case STAMP_WIDGET_ACTIONS.SWITCH_MODE:
      return {
        ...state,
        mode: action.payload as ClockType,
      };

    case STAMP_WIDGET_ACTIONS.UPDATE_MESSAGE:
      return {
        ...state,
        message: action.payload as string,
      };

    case STAMP_WIDGET_ACTIONS.BLOCK_OPERATION:
      return {
        ...state,
        isEnableStartStamp: false,
        isEnableEndStamp: false,
        isEnableRestartStamp: false,
        mode: null,
      };

    default:
      return state;
  }
}
