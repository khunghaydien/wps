import {
  CLOCK_TYPE,
  DailyStampTime,
  EditingDailyStampTime,
  MODE_TYPE,
  ModeType,
} from '@attendance/domain/models/DailyStampTime';

import ROOT from './actionType';

type State = EditingDailyStampTime;

const ACTION_TYPE_ROOT = `${ROOT}/STAMP_WIDGET` as const;
export const ACTIONS = {
  APPLY_DAILY_STAMP_TIME: `${ACTION_TYPE_ROOT}/APPLY_DAILY_STAMP_TIME`,
  SWITCH_MODE: `${ACTION_TYPE_ROOT}/SWITCH_MODE`,
  UPDATE_MESSAGE: `${ACTION_TYPE_ROOT}/UPDATE_MESSAGE`,
  BLOCK_OPERATION: `${ACTION_TYPE_ROOT}/BLOCK_OPERATION`,
} as const;

export const actions = {
  /**
   * 打刻情報を適用する
   */
  applyDailyStampTime: (
    dailyStampTime: DailyStampTime
  ): {
    type: typeof ACTIONS.APPLY_DAILY_STAMP_TIME;
    payload: DailyStampTime;
  } => ({
    type: ACTIONS.APPLY_DAILY_STAMP_TIME,
    payload: dailyStampTime,
  }),

  /**
   * 出勤・退勤を切り替える
   */
  switchModeType: (
    clockType: ModeType
  ): {
    type: typeof ACTIONS.SWITCH_MODE;
    payload: ModeType;
  } => ({
    type: ACTIONS.SWITCH_MODE,
    payload: clockType,
  }),

  /**
   * メッセージを更新する
   */
  updateMessage: (
    message: string
  ): {
    type: typeof ACTIONS.UPDATE_MESSAGE;
    payload: string;
  } => ({
    type: ACTIONS.UPDATE_MESSAGE,
    payload: message,
  }),

  /**
   * ユーザー操作を防止する
   */
  blockOperation: (): {
    type: typeof ACTIONS.BLOCK_OPERATION;
  } => ({
    type: ACTIONS.BLOCK_OPERATION,
  }),
};

const initialState = {
  // NOTE: 打刻情報取得APIのレスポンス値を適用するまで、出退勤いずれも選択不可とする
  isEnableStartStamp: false,
  isEnableEndStamp: false,
  isEnableRestartStamp: false,
  stampInDate: '',
  stampOutDate: '',
  stampReInDate: '',
  mode: null,
  message: '',
  isPossibleFixDailyRequest: true,
  record: null,
};

type Action = ReturnType<typeof actions[keyof typeof actions]>;

export default function reducer(
  state: State = initialState,
  action: Action
): State {
  switch (action.type) {
    case ACTIONS.APPLY_DAILY_STAMP_TIME: {
      const {
        isEnableStartStamp,
        isEnableEndStamp,
        isEnableRestartStamp,
        stampInDate,
        stampOutDate,
        stampReInDate,
        defaultAction,
      } = action.payload;

      let mode = null;

      switch (defaultAction) {
        case CLOCK_TYPE.IN:
          mode = isEnableStartStamp ? MODE_TYPE.CLOCK_IN : MODE_TYPE.CLOCK_REIN;
          break;
        case CLOCK_TYPE.OUT:
          mode = MODE_TYPE.CLOCK_OUT;
          break;

        default:
          break;
      }

      return {
        ...state,
        isEnableStartStamp,
        isEnableEndStamp,
        isEnableRestartStamp,
        stampInDate,
        stampOutDate,
        stampReInDate,
        mode,
        message: '',
      };
    }

    case ACTIONS.SWITCH_MODE:
      return {
        ...state,
        mode: action.payload,
      };

    case ACTIONS.UPDATE_MESSAGE:
      return {
        ...state,
        message: action.payload,
      };

    case ACTIONS.BLOCK_OPERATION:
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
