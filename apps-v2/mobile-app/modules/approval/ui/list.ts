export type State = {
  comment: string;
};

const ACTION_ROOT = `MOBILE/MODULES/APPROVAL/UI/LIST` as const;

const ACTION_TYPES = {
  INITIALIZE: `${ACTION_ROOT}/INITIALIZE`,
  SET_COMMENT: `${ACTION_ROOT}/SET_COMMENT`,
} as const;

type Initialize = {
  type: typeof ACTION_TYPES.INITIALIZE;
};

type SetComment = {
  type: typeof ACTION_TYPES.SET_COMMENT;
  payload: string;
};

type Action = Initialize | SetComment;

export const initialize = (): Initialize => ({
  type: ACTION_TYPES.INITIALIZE,
});

export const setComment = (comment: string): SetComment => ({
  type: ACTION_TYPES.SET_COMMENT,
  payload: comment,
});

const initialState: State = {
  comment: '',
};

export default (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case ACTION_TYPES.INITIALIZE: {
      return initialState;
    }

    case ACTION_TYPES.SET_COMMENT: {
      const comment = action.payload;
      return {
        ...state,
        comment,
      };
    }

    default:
      return state;
  }
};
