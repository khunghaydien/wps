export type State = {
  // 位置情報を送信するか
  willSendLocation: boolean;
  // 打刻コメント
  comment: string;
  // 通勤往路回数
  commuteForwardCount: number;
  // 通勤復路回数
  commuteBackwardCount: number;
};

type Action = {
  type: string;
  payload?: any;
};

type SetWillSendLocationAction = {
  type: 'ATTENDANCE/TIME_STAMP/UI/SET_WILL_SEND_LOCATION';
  payload: boolean;
};

type EditCommentAction = {
  type: 'ATTENDANCE/TIME_STAMP/UI/EDIT_COMMENT';
  payload: string;
};

type ClearCommentAction = {
  type: 'ATTENDANCE/TIME_STAMP/UI/CLEAR_COMMENT';
};

type SetCommuteCountAction = {
  type: 'ATTENDANCE/TIME_STAMP/UI/SET_COMMUTE_COUNT';
  payload: {
    commuteForwardCount: number;
    commuteBackwardCount: number;
  };
};

const ACTIONS = {
  SET_WILL_SEND_LOCATION: 'ATTENDANCE/TIME_STAMP/UI/SET_WILL_SEND_LOCATION',
  SET_USE_MANAGE_COMMUTE_COUNT:
    'ATTENDANCE/TIME_STAMP/UI/SET_USE_MANAGE_COMMUTE_COUNT',
  EDIT_COMMENT: 'ATTENDANCE/TIME_STAMP/UI/EDIT_COMMENT',
  CLEAR_COMMENT: 'ATTENDANCE/TIME_STAMP/UI/CLEAR_COMMENT',
  SET_COMMUTE_COUNT: 'ATTENDANCE/TIME_STAMP/UI/SET_COMMUTE_COUNT',
} as const;

export const actions = {
  setWillSendLocation: (
    willSendLocation: boolean
  ): SetWillSendLocationAction => ({
    type: ACTIONS.SET_WILL_SEND_LOCATION,
    payload: willSendLocation,
  }),
  editComment: (comment: string): EditCommentAction => ({
    type: ACTIONS.EDIT_COMMENT,
    payload: comment,
  }),
  clearComment: (): ClearCommentAction => ({
    type: ACTIONS.CLEAR_COMMENT,
  }),
  setCommuteCount: (
    commuteForwardCount: number,
    commuteBackwardCount: number
  ): SetCommuteCountAction => ({
    type: ACTIONS.SET_COMMUTE_COUNT,
    payload: {
      commuteForwardCount,
      commuteBackwardCount,
    },
  }),
};

const initialState: State = {
  willSendLocation: false,
  comment: '',
  commuteForwardCount: null,
  commuteBackwardCount: null,
};

export default (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case ACTIONS.SET_WILL_SEND_LOCATION:
      return {
        ...state,
        willSendLocation: action.payload,
      };
    case ACTIONS.EDIT_COMMENT:
      return {
        ...state,
        comment: action.payload,
      };
    case ACTIONS.CLEAR_COMMENT:
      return {
        ...state,
        comment: '',
      };
    case ACTIONS.SET_COMMUTE_COUNT:
      return {
        ...state,
        commuteForwardCount: action.payload.commuteForwardCount,
        commuteBackwardCount: action.payload.commuteBackwardCount,
      };
    default:
      return state;
  }
};
