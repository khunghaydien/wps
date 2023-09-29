// State

type State = {
  isOpen: boolean;
  date: Date | null;
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
  type: '/PLANNER-PC/MODULES/UI/EVENT_LIST_POPUP/OPEN';
  payload: {
    date: Date;
    top: number;
    left: number;
  };
};

type ClosePopup = {
  type: '/PLANNER-PC/MODULES/UI/EVENT_LIST_POPUP/CLOSE';
};

type Action = OpenPopup | ClosePopup;

const OPEN_POPUP = '/PLANNER-PC/MODULES/UI/EVENT_LIST_POPUP/OPEN';
const CLOSE_POPUP = '/PLANNER-PC/MODULES/UI/EVENT_LIST_POPUP/CLOSE';

export const actions = {
  open: (date: Date, top: number, left: number): OpenPopup => ({
    type: OPEN_POPUP,
    payload: { date, top, left },
  }),

  close: (): ClosePopup => ({
    type: CLOSE_POPUP,
  }),
};

// Reducer

export default (state: State = initialState, action: Action) => {
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

    default: {
      return state;
    }
  }
};
