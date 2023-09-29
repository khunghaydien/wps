import ROOT from './actionType';

type State = {
  comment: string;
};

/** Define constants */
const ACTION_TYPE_ROOT = `${ROOT}/DETAIL` as const;
export const ACTION_TYPE = {
  EDIT_COMMENT: `${ACTION_TYPE_ROOT}/EDIT_COMMENT`,
  PROCESS_SUCCESS: `${ACTION_TYPE_ROOT}/PROCEED_SUCCESS`,
} as const;

type EditComment = {
  type: typeof ACTION_TYPE.EDIT_COMMENT;
  payload: string;
};

type ProcessSuccess = {
  type: typeof ACTION_TYPE.PROCESS_SUCCESS;
};

type Action = EditComment | ProcessSuccess;

export const actions = {
  editComment: (comment: string): EditComment => ({
    type: ACTION_TYPE.EDIT_COMMENT,
    payload: comment,
  }),
  processSuccess: (): ProcessSuccess => ({
    type: ACTION_TYPE.PROCESS_SUCCESS,
  }),
};

/** Define reducer */

const initialState: State = {
  comment: '',
};

export default (state: State = initialState, action: Action) => {
  switch (action.type) {
    case ACTION_TYPE.EDIT_COMMENT:
      return {
        ...state,
        comment: action.payload,
      };
    case ACTION_TYPE.PROCESS_SUCCESS:
      return initialState;
    default:
      return state;
  }
};
