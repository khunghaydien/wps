// State

type State = {
  isOpen: boolean;
  date: Date | null | undefined;
  top: number;
  left: number;
};

const initialState = {
  isOpen: false,
  date: null,
  top: 0,
  left: 0,
};

// Actions
const ACTION_TYPES = {
  OPEN: 'MODULES/EXP/UI/EVENT_LIST_POPUP/OPEN',
  MOVE: 'MODULES/EXP/UI/EVENT_LIST_POPUP/MOVE',
  CLOSE: 'MODULES/EXP/UI/EVENT_LIST_POPUP/CLOSE',
};

type ActionTypes = typeof ACTION_TYPES;

type OpenPopup = {
  type: ActionTypes['OPEN'];
  payload: {
    date: Date;
    top: number;
    left: number;
  };
};

type MovePopup = {
  type: ActionTypes['MOVE'];
  payload: {
    top: number;
    left: number;
  };
};

type ClosePopup = {
  type: ActionTypes['CLOSE'];
};

type Action = OpenPopup | MovePopup | ClosePopup;

export const actions = {
  open: (date: Date, top: number, left: number): OpenPopup => ({
    type: ACTION_TYPES.OPEN,
    payload: { date, top, left },
  }),
  move: (top: number, left: number): MovePopup => ({
    type: ACTION_TYPES.MOVE,
    payload: {
      top,
      left,
    },
  }),
  close: (): ClosePopup => ({
    type: ACTION_TYPES.CLOSE,
  }),
};

// Reducer

export default (state = initialState, action: Action): State => {
  switch (action.type) {
    case ACTION_TYPES.OPEN: {
      return {
        ...state,
        ...(action as OpenPopup).payload,
        isOpen: true,
      };
    }
    case ACTION_TYPES.MOVE: {
      return {
        ...state,
        ...(action as MovePopup).payload,
      };
    }
    case ACTION_TYPES.CLOSE: {
      return {
        ...initialState,
        isOpen: false,
      };
    }
    default: {
      return state;
    }
  }
};
