// Constants
const TOGGLE_PANE = 'modules/ui/timeTrack/isExpanded/TOGGLE_PANE';

// Actions
export const togglePane = () => {
  return { type: TOGGLE_PANE };
};

export const actions = {
  togglePane,
};

// Reducer
const initialState = false;

export default (state = initialState, action) => {
  switch (action.type) {
    case TOGGLE_PANE:
      return !state;

    default:
      return state;
  }
};
