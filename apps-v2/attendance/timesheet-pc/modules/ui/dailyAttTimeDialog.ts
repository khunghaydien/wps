import ROOT from './actionType';

export type State = string;

const initialState: State = '';

const ACTION_TYPE_ROOT = `${ROOT}/DAILY_ATT_TIME_DIALOG` as const;

const ACTION_TYPE = {
  OPEN: `${ACTION_TYPE_ROOT}/OPEN`,
  CLOSE: `${ACTION_TYPE_ROOT}/CLOSE`,
} as const;

type Open = {
  type: typeof ACTION_TYPE.OPEN;
  payload: string;
};

type Close = {
  type: typeof ACTION_TYPE.CLOSE;
};

type Action = Open | Close;

export const open = (targetDate: string): Open => ({
  type: ACTION_TYPE.OPEN,
  payload: targetDate,
});

export const close = (): Close => ({
  type: ACTION_TYPE.CLOSE,
});

export default function reducer(
  state: State = initialState,
  action: Action
): State {
  switch (action.type) {
    case ACTION_TYPE.OPEN:
      return action.payload;
    case ACTION_TYPE.CLOSE:
      return '';
    default:
      return state;
  }
}
