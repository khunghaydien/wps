import ROOT from './actionType';

type State = Array<string>;

const ACTION_TYPE_ROOT = `${ROOT}/SELECTED_IDS` as const;
export const ACTION_TYPE = {
  SET: `${ACTION_TYPE_ROOT}/SET`,
  REMOVE: `${ACTION_TYPE_ROOT}/REMOVE`,
  CLEAR: `${ACTION_TYPE_ROOT}/CLEAR`,
} as const;

type SetAction = {
  type: typeof ACTION_TYPE.SET;
  payload: Array<string>;
};

type RemoveAction = {
  type: typeof ACTION_TYPE.REMOVE;
  payload: string;
};

type ClearAction = {
  type: typeof ACTION_TYPE.CLEAR;
};

type Action = SetAction | RemoveAction | ClearAction;

export const actions = {
  set: (ids: Array<string>): SetAction => ({
    type: ACTION_TYPE.SET,
    payload: ids,
  }),
  remove: (id: string): RemoveAction => ({
    type: ACTION_TYPE.REMOVE,
    payload: id,
  }),
  clear: (): ClearAction => ({
    type: ACTION_TYPE.CLEAR,
  }),
};

const initialState: State = [];

export default (state: State = initialState, action: Action) => {
  switch (action.type) {
    case ACTION_TYPE.SET:
      return action.payload;
    case ACTION_TYPE.REMOVE:
      return state.filter((x) => x !== action.payload);
    case ACTION_TYPE.CLEAR:
      return initialState;
    default:
      return state;
  }
};
