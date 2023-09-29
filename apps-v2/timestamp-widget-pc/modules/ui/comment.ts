type State = {
  comment: string;
};

export const initialState: State = {
  comment: '',
};

// Actions

type CommentEdit = {
  type: 'TIMESTAMP_WIDGET_COMMENT_EDIT';
  payload: string;
};

type CommentClear = {
  type: 'TIMESTAMP_WIDGET_COMMENT_CLEAR';
};

type Action = CommentEdit | CommentClear;

export const COMMENT_EDIT: CommentEdit['type'] =
  'TIMESTAMP_WIDGET_COMMENT_EDIT';
export const COMMENT_CLEAR: CommentClear['type'] =
  'TIMESTAMP_WIDGET_COMMENT_CLEAR';

export const actions = {
  edit: (comment: string) => ({
    type: COMMENT_EDIT,
    payload: comment,
  }),
  clear: () => ({
    type: COMMENT_CLEAR,
  }),
};

// Reducer

export default function (state: State = initialState, action: Action) {
  switch (action.type) {
    case COMMENT_EDIT:
      return {
        comment: action.payload,
      };
    case COMMENT_CLEAR:
      return {
        ...initialState,
      };
    default:
      return state;
  }
}
