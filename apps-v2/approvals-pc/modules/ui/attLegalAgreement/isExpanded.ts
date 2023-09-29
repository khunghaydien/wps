import ROOT from './actionType';

/*
 * State
 */
type State = boolean;

/*
 * Actions
 */
const ACTION_TYPE_ROOT = `${ROOT}/IS_EXPANDED` as const;
const ACTION_TYPE = {
  TOGGLE_PANE: `${ACTION_TYPE_ROOT}/TOGGLE_PANE`,
} as const;

type TogglePane = {
  type: typeof ACTION_TYPE.TOGGLE_PANE;
};

type Action = TogglePane;

export const togglePane = (): TogglePane => ({
  type: ACTION_TYPE.TOGGLE_PANE,
});

/*
 * Reducer
 */
const initialState: State = false;

export default (state: State = initialState, action: Action) => {
  switch (action.type) {
    case ACTION_TYPE.TOGGLE_PANE:
      return !state;

    default:
      return state;
  }
};
