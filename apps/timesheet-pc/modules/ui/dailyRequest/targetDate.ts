type State = string;

const initialState: State = null;

export const ACTIONS = {
  SET: 'TIMESHEET-PC/UI/DAILY_REQUEST/TARGET_DATE/SET',
  UNSET: 'TIMESHEET-PC/UI/DAILY_REQUEST/TARGET_DATE/UNSET',
} as const;

export const actions = {
  set: (conditions: string) => ({
    type: ACTIONS.SET,
    payload: conditions,
  }),

  unset: () => ({
    type: ACTIONS.UNSET,
  }),
};
type Actions =
  | ReturnType<typeof actions.set>
  | ReturnType<typeof actions.unset>;

export default (state = initialState, action: Actions): State => {
  switch (action.type) {
    case ACTIONS.SET:
      return action.payload;

    case ACTIONS.UNSET:
      return null;

    default:
      return state;
  }
};
