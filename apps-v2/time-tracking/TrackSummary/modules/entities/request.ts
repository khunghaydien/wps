/**
 * GENIE-12114
 * NOTE
 *
 * 申請対象日が必ず社員の有効期間内になるようにする。
 *
 * 「今日」が集計期間内だった場合に集計期間の開始日か終了日は社員の有効期間外の場合がある。
 * その場合にはバックエンドで社員の有効期間外のエラーが出るため、暫定対応としてフロントエンド側
 * で有効期間内の日付を記録して利用するようにしている。
 */

// State
type State = {
  targetDate: string;
};

const initialState: State = { targetDate: '' };

// Actions

export const UPDATE = 'TRACK_SUMMARY/ENTITIES/REQUEST/UPDATE';

type Update = {
  type: 'TRACK_SUMMARY/ENTITIES/REQUEST/UPDATE';
  payload: {
    targetDate: string;
  };
};

export const actions = {
  update: (targetDate: string): Update => ({
    type: UPDATE,
    payload: { targetDate },
  }),
};

type Action = Update;

// Reducer

export default function reducer(
  state: State = initialState,
  action: Action
): State {
  switch (action.type) {
    case UPDATE:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
}
