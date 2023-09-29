import { $PropertyType } from 'utility-types';

export type State = {
  comment: string;
};

type Initialize = {
  type: 'MOBILE/MODULES/APPROVAL/UI/DETAIL/INITIALIZE';
};

type SetComment = {
  type: 'MOBILE/MODULES/APPROVAL/UI/DETAIL/SET_COMMENT';
  payload: string;
};

type Action = Initialize | SetComment;

export const INITIALIZE: $PropertyType<Initialize, 'type'> =
  'MOBILE/MODULES/APPROVAL/UI/DETAIL/INITIALIZE';

export const SET_COMMENT: $PropertyType<SetComment, 'type'> =
  'MOBILE/MODULES/APPROVAL/UI/DETAIL/SET_COMMENT';

export const actions = {
  initialize: (): Initialize => ({
    type: INITIALIZE,
  }),
  setComment: (comment: string): SetComment => ({
    type: SET_COMMENT,
    payload: comment,
  }),
};

export const initialState: State = {
  comment: '',
};

export default (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case INITIALIZE: {
      return initialState;
    }

    case SET_COMMENT: {
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
