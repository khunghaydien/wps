// State
type State = { isOpened: boolean };

const initialState: State = { isOpened: false };

// Actions
const ACTION_ROOT = 'ADMIN-PC-V2/ORGANIZATION_HIERARCHY/UI/REVISION_DIALOG';
const ActionType = {
  OPEN: `${ACTION_ROOT}/OPEN`,
  CLOSE: `${ACTION_ROOT}/CLOSE`,
};

type OpenAction = {
  type: typeof ActionType.OPEN;
};

type CloseAction = {
  type: typeof ActionType.CLOSE;
};

export const actions = {
  open: (): OpenAction => ({ type: ActionType.OPEN }),
  close: (): CloseAction => ({ type: ActionType.CLOSE }),
};

type Action = OpenAction | CloseAction;

// Reducer
const reducer = (state: State = initialState, action: Action) => {
  switch (action.type) {
    case ActionType.OPEN: {
      return { isOpened: true };
    }
    case ActionType.CLOSE: {
      return { isOpened: false };
    }
    default:
      return state;
  }
};

export default reducer;
