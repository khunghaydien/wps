// State

type State = {
  isOpen: boolean;
  date: Date | null | undefined;
  top: number;
  left: number;
};

export const initialState = {
  isOpen: false,
  date: null,
  top: 0,
  left: 0,
};

// Actions

type OpenPopup = {
  type: '/DAILY-SUMMARY/MODULES/UI/EVENT_LIST_POPUP/OPEN';
  payload: {
    date: Date;
    top: number;
    left: number;
  };
};

type ClosePopup = {
  type: '/DAILY-SUMMARY/MODULES/UI/EVENT_LIST_POPUP/CLOSE';
};

type MovePopup = {
  type: '/DAILY-SUMMARY/MODULES/UI/EVENT_LIST_POPUP/MOVE';
  payload: {
    top: number;
    left: number;
  };
};

type Action = OpenPopup | ClosePopup | MovePopup;

export const OPEN_POPUP = '/DAILY-SUMMARY/MODULES/UI/EVENT_LIST_POPUP/OPEN';
export const CLOSE_POPUP = '/DAILY-SUMMARY/MODULES/UI/EVENT_LIST_POPUP/CLOSE';
export const MOVE_POPUP = '/DAILY-SUMMARY/MODULES/UI/EVENT_LIST_POPUP/MOVE';

export const actions = {
  open: (date: Date, top: number, left: number): OpenPopup => ({
    type: OPEN_POPUP,
    payload: { date, top, left },
  }),

  close: (): ClosePopup => ({
    type: CLOSE_POPUP,
  }),

  move: (top: number, left: number): MovePopup => ({
    type: MOVE_POPUP,
    payload: {
      top,
      left,
    },
  }),
};

// Reducer

export default (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case OPEN_POPUP: {
      return {
        ...state,
        ...action.payload,
        isOpen: true,
      };
    }

    case CLOSE_POPUP: {
      return {
        ...initialState,
        isOpen: false,
      };
    }

    case MOVE_POPUP: {
      return {
        ...state,
        ...action.payload,
      };
    }

    default: {
      return state;
    }
  }
};
