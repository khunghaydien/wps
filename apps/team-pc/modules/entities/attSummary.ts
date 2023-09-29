import { AttSummary } from '../../../domain/models/team/AttSummary';

type State = AttSummary;

const ACTION_TYPES = {
  SEARCH_SUCCESS: 'TEAM_PC/ENTITIES/ATT_SUMMARY/SEARCH_SUCCESS',
  CLEAR: 'TEAM_PC/ENTITIES/ATT_SUMMARY/CLEAR',
};

export const actions = {
  searchSuccess: (attSummary: AttSummary) => ({
    type: ACTION_TYPES.SEARCH_SUCCESS,
    payload: {
      attSummary,
    },
  }),
  clear: () => ({
    type: ACTION_TYPES.CLEAR,
  }),
};

const initialState: State = {
  records: [],
};

export default (state: State = initialState, action: any): State => {
  const { type, payload } = action;
  switch (type) {
    case ACTION_TYPES.SEARCH_SUCCESS: {
      const { attSummary } = payload;

      return {
        ...attSummary,
      };
    }
    case ACTION_TYPES.CLEAR:
      return initialState;
    default:
      return state;
  }
};
