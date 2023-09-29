type State = {
  isOpened: boolean;
};

const initialState: State = {
  /** @type {Boolean} */
  isOpened: true, // NOTE: 展開されている状態がデフォルト
};

const ACTIONS = {
  TOGGLE: 'TIMESHEET-PC/STAMP_WIDGET/TOGGLE',
} as const;

export const actions = {
  toggle: () => ({ type: ACTIONS.TOGGLE }),
};

type Actions = ReturnType<typeof actions.toggle>;

export default function reducer(state = initialState, action: Actions): State {
  switch (action.type) {
    case ACTIONS.TOGGLE:
      return {
        ...state,
        isOpened: !state.isOpened,
      };

    default:
      return state;
  }
}
