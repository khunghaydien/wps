const ACTION_PREFIX = 'SUB_APP/EVENT_DIALOG/MODULES/UI/CONDITIONS';
export const ACTIONS = {
  SET: `${ACTION_PREFIX}/SET`,
  CLOSE: `${ACTION_PREFIX}/CLOSE`,
};

export type PsaEventPopupCondtions = {
  isOpen: boolean;
  top: number;
  left: number;
};

export const actions = {
  set: (conditions: PsaEventPopupCondtions) => ({
    type: ACTIONS.SET,
    payload: conditions,
  }),
  close: () => ({
    type: ACTIONS.CLOSE,
  }),
};

export const initialState = {
  isOpen: false,
  top: 0,
  left: 0,
};

export default (state: PsaEventPopupCondtions = initialState, action: any) => {
  switch (action.type) {
    case ACTIONS.SET:
      return action.payload;
    case ACTIONS.CLOSE:
      return initialState;
    default:
      return state;
  }
};
