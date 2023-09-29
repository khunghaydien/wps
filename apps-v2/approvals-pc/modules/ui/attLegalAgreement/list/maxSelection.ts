import { DEFAULT_MAX_CHECKED } from '@attendance/ui/pc/approval-pc/constants';

import ROOT from './actionType';

const ACTION_TYPE_ROOT = `${ROOT}/MAX_SELECTION`;

const ACTION_TYPE = {
  SET: `${ACTION_TYPE_ROOT}/SET`,
  CLEAR: `${ACTION_TYPE_ROOT}/CLEAR`,
} as const;

export type State = number;

const initialState = DEFAULT_MAX_CHECKED;

export const actions = {
  set: (value: number) => ({
    type: ACTION_TYPE.SET,
    payload: value,
  }),
  clear: () => ({
    type: ACTION_TYPE.CLEAR,
  }),
};

type Actions = Action<typeof actions>;

export default (state: State = initialState, action: Actions): State => {
  switch (action.type) {
    case ACTION_TYPE.SET: {
      return action.payload;
    }
    case ACTION_TYPE.CLEAR: {
      return initialState;
    }
    default: {
      return state;
    }
  }
};
