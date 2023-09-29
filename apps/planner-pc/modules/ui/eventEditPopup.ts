// State

type State = {
  isOpen: boolean;
  top: number;
  left: number;
};

export const initialState = {
  isOpen: false,
  top: 0,
  left: 0,
};

// Actions

type OpenPopup = {
  type: '/PLANNER-PC/MODULES/UI/EVENT_EDIT_POPUP/OPEN';
  payload: {
    top: number;
    left: number;
  };
};

type ClosePopup = {
  type: '/PLANNER-PC/MODULES/UI/EVENT_EDIT_POPUP/CLOSE';
};

type Action = OpenPopup | ClosePopup;

export const OPEN_POPUP = '/PLANNER-PC/MODULES/UI/EVENT_EDIT_POPUP/OPEN';
export const CLOSE_POPUP = '/PLANNER-PC/MODULES/UI/EVENT_EDIT_POPUP/CLOSE';

export const actions = {
  open: (layout: { top: number; left: number }): OpenPopup => ({
    type: OPEN_POPUP,
    payload: { ...layout },
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
      return initialState;
    }

    default: {
      return state;
    }
  }
};
