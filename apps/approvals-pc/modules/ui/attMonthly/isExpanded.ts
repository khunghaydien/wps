/*
 * State
 */
type State = boolean;

/*
 * Actions
 */
type TogglePane = {
  type: 'modules/ui/attMonthly/isExpanded/TOGGLE_PANE';
};

type Action = TogglePane;

const ActionType: {
  [key: string]: Action['type'];
} = {
  TOGGLE_PANE: 'modules/ui/attMonthly/isExpanded/TOGGLE_PANE',
};

export const togglePane = (): TogglePane => ({
  type: 'modules/ui/attMonthly/isExpanded/TOGGLE_PANE',
});

/*
 * Reducer
 */
const initialState: State = false;

export default (state: State = initialState, action: Action) => {
  switch (action.type) {
    case ActionType.TOGGLE_PANE:
      return !state;

    default:
      return state;
  }
};
