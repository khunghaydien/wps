type State = {
  isLoading: boolean;
};

type StartLoadingAction = {
  type: 'TIMESHEET-PC/UI/DAILY_ALLOWANCE/START_LOADING';
};
type EndLoadingAction = {
  type: 'TIMESHEET-PC/UI/DAILY_ALLOWANCE/END_LOADING';
};
type Action = StartLoadingAction | EndLoadingAction;

const initialState: State = {
  isLoading: false,
};

const ACTIONS = {
  START_LOADING: 'TIMESHEET-PC/UI/DAILY_ALLOWANCE/START_LOADING',
  END_LOADING: 'TIMESHEET-PC/UI/DAILY_ALLOWANCE/END_LOADING',
} as const;

export const actions = {
  startLoading: (): StartLoadingAction => ({
    type: ACTIONS.START_LOADING,
  }),

  endLoading: (): EndLoadingAction => ({
    type: ACTIONS.END_LOADING,
  }),
};

export default function reducer(
  state: State = initialState,
  action: Action
): State {
  switch (action.type) {
    case ACTIONS.START_LOADING:
      return {
        isLoading: true,
      };
    case ACTIONS.END_LOADING:
      return {
        isLoading: false,
      };
    default:
      return state;
  }
}
