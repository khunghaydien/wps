import ROOT from './actionType';

export type State = boolean;

const initialState: State = false;

const ACTION_TYPE_ROOT =
  `${ROOT}/LOADING_DAILY_OBJECTIVELY_EVENT_LOG_DIALOG` as const;

const ACTION_TYPE = {
  START: `${ACTION_TYPE_ROOT}/START`,
  FINISH: `${ACTION_TYPE_ROOT}/FINISH`,
} as const;

type Start = {
  type: typeof ACTION_TYPE.START;
};

type Finish = {
  type: typeof ACTION_TYPE.FINISH;
};

type Action = Start | Finish;

export const actions = {
  start: (): Start => ({
    type: ACTION_TYPE.START,
  }),

  finish: (): Finish => ({
    type: ACTION_TYPE.FINISH,
  }),
};

export default function reducer(
  state: State = initialState,
  action: Action
): State {
  switch (action.type) {
    case ACTION_TYPE.START:
      return true;
    case ACTION_TYPE.FINISH:
      return false;
    default:
      return state;
  }
}
