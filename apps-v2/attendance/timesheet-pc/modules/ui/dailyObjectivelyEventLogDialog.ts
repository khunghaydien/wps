import ROOT from './actionType';

export type State = boolean;

const initialState: State = false;

const ACTION_TYPE_ROOT = `${ROOT}/DAILY_OBJECTIVELY_EVENT_LOG_DIALOG` as const;

const ACTION_TYPE = {
  OPEN: `${ACTION_TYPE_ROOT}/OPEN`,
  CLOSE: `${ACTION_TYPE_ROOT}/CLOSE`,
} as const;

type Open = {
  type: typeof ACTION_TYPE.OPEN;
};

type Close = {
  type: typeof ACTION_TYPE.CLOSE;
};

type Action = Open | Close;

export const open = (): Open => ({
  type: ACTION_TYPE.OPEN,
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
      return true;
    case ACTION_TYPE.CLOSE:
      return false;
    default:
      return state;
  }
}
