import { AttSummaryPeriodList } from '../../../domain/models/team/AttSummaryPeriodList';

type State = AttSummaryPeriodList;

const ACTION_TYPES = {
  FETCH_SUCCESS: 'TEAM_PC/ENTITIES/ATT_SUMMARY_PERIOD_LIST/FETCH_SUCCESS',
  CLEAR: 'TEAM_PC/ENTITIES/ATT_SUMMARY_PERIOD_LIST/CLEAR',
};

export const actions = {
  fetchSuccess: (attSummaryPeriodList: AttSummaryPeriodList) => ({
    type: ACTION_TYPES.FETCH_SUCCESS,
    payload: {
      attSummaryPeriodList,
    },
  }),
  clear: () => ({
    type: ACTION_TYPES.CLEAR,
  }),
};

const initialState: State = {
  periods: [],
  currentPeriodName: null,
};

export default (state: State = initialState, action: any): State => {
  const { type, payload } = action;
  switch (type) {
    case ACTION_TYPES.FETCH_SUCCESS: {
      const { attSummaryPeriodList } = payload;

      return {
        ...attSummaryPeriodList,
      };
    }
    case ACTION_TYPES.CLEAR:
      return initialState;
    default:
      return state;
  }
};
