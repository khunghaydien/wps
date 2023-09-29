// State

type State = {
  isManHoursGraphOpened: boolean;
};

const initialState: State = {
  isManHoursGraphOpened: false,
};

// Actions

type ToggleManHoursGraph = {
  type: 'TIMESHEET-PC/UI/TIMESHEET/TOGGLE_MAN_HOURS_GRAPH';
};

type Action = ToggleManHoursGraph;

const ACTION_TYPES = {
  TOGGLE_MAN_HOURS_GRAPH: 'TIMESHEET-PC/UI/TIMESHEET/TOGGLE_MAN_HOURS_GRAPH',
} as const;

export const actions = {
  toggleManHoursGraph: (): ToggleManHoursGraph => ({
    type: ACTION_TYPES.TOGGLE_MAN_HOURS_GRAPH,
  }),
};

// Reducer

export default function reducer(
  state: State = initialState,
  action: Action
): State {
  switch (action.type) {
    case ACTION_TYPES.TOGGLE_MAN_HOURS_GRAPH:
      return {
        ...state,
        isManHoursGraphOpened: !state.isManHoursGraphOpened,
      };

    default:
      return state;
  }
}
