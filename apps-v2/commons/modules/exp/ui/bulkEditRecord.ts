const ACTION_TYPES = {
  TOGGLE: 'MODULES/EXP/UI/BULK_EDIT_MODE/TOGGLE',
  SET_REMOVE: 'MODULES/EXP/UI/BULK_EDIT_MODE/REMOVE_IDS/SET',
  CLEAR_REMOVE: 'MODULES/EXP/UI/BULK_EDIT_MODE/REMOVE_IDS/CLEAR',
} as const;

type Toggle = {
  type: typeof ACTION_TYPES['TOGGLE'];
};

type SetRemove = {
  type: typeof ACTION_TYPES['SET_REMOVE'];
  payload: string[];
};

type ClearRemove = {
  type: typeof ACTION_TYPES['CLEAR_REMOVE'];
};

export const actions = {
  toggle: (): Toggle => ({
    type: ACTION_TYPES.TOGGLE,
  }),
  setRemove: (ids: string[]): SetRemove => ({
    type: ACTION_TYPES.SET_REMOVE,
    payload: ids,
  }),
  clearRemove: (): ClearRemove => ({
    type: ACTION_TYPES.CLEAR_REMOVE,
  }),
};

const initialState = {
  isEnabled: false,
  removeIds: [],
};

export default (
  state = initialState,
  action: Toggle | SetRemove | ClearRemove
) => {
  switch (action.type) {
    case ACTION_TYPES.TOGGLE:
      return {
        ...state,
        isEnabled: !state.isEnabled,
      };
    case ACTION_TYPES.SET_REMOVE:
      return {
        ...state,
        removeIds: state.removeIds.concat(action.payload),
      };
    case ACTION_TYPES.CLEAR_REMOVE:
      return {
        ...state,
        removeIds: [],
      };
    default:
      return state;
  }
};
