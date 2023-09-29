// YYYY-MM-DD形式の文字列
type State = string;

const initialState: State = null;

const ACTIONS = {
  SET: 'TIMESHEET-PC/CLIENT/SELECTED_PERIOD_START_DATE/SET',
} as const;

export const actions = {
  set: (period: string) => ({ type: ACTIONS.SET, payload: period }),
};

type Actions = ReturnType<typeof actions.set>;

export default function reducer(state = initialState, action: Actions): State {
  switch (action.type) {
    case ACTIONS.SET:
      return action.payload;

    default:
      return state;
  }
}
