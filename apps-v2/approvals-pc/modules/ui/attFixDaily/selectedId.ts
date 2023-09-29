import ROOT from './actionType';

type State = string;

const ACTION_TYPE_ROOT = `${ROOT}/SELECTED_ID`;

const ACTION_TYPE = {
  SET: `${ACTION_TYPE_ROOT}/SET`,
  CLEAR: `${ACTION_TYPE_ROOT}/CLEAR`,
} as const;

type SetAction = {
  type: typeof ACTION_TYPE.SET;
  payload: string;
};

type ClearAction = {
  type: typeof ACTION_TYPE.CLEAR;
};

type Actions = SetAction | ClearAction;

export const actions = {
  set: (id: string): SetAction => ({
    type: ACTION_TYPE.SET,
    payload: id,
  }),
  clear: (): ClearAction => ({
    type: ACTION_TYPE.CLEAR,
  }),
};

const initialState = '';

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
