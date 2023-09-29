import { DEFAULT_MAX_CHECKED } from '@attendance/ui/pc/approval-pc/constants';

import ROOT from './actionType';

type State = {
  ids: string[];
  max: number;
};

const ACTION_TYPE_ROOT = `${ROOT}/CHECKED_IDS`;

export const ACTION_TYPE = {
  SET: `${ACTION_TYPE_ROOT}/SET`,
  SET_MAX: `${ACTION_TYPE_ROOT}/SET_MAX`,
  CLEAR: `${ACTION_TYPE_ROOT}/CLEAR`,
} as const;

export const actions = {
  set: (ids: string[]) => ({
    type: ACTION_TYPE.SET,
    payload: ids,
  }),
  setMax: (max: number) => ({
    type: ACTION_TYPE.SET_MAX,
    payload: max,
  }),
  clear: () => ({
    type: ACTION_TYPE.CLEAR,
  }),
};

type Actions = Action<typeof actions>;

const initialState: State = {
  ids: [],
  max: DEFAULT_MAX_CHECKED,
};

export default (state: State = initialState, action: Actions): State => {
  switch (action.type) {
    case ACTION_TYPE.SET: {
      return {
        ...state,
        ids: action.payload,
      };
    }
    case ACTION_TYPE.SET_MAX: {
      return {
        ...state,
        max: action.payload,
      };
    }
    case ACTION_TYPE.CLEAR: {
      return initialState;
    }
    default: {
      return state;
    }
  }
};
