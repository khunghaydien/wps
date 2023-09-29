import defaultSummary, {
  Summary,
} from '../../../../domain/models/time-tracking/Summary';

type State = { targetDate: string | undefined; content: Summary };

const initialState: State = { targetDate: undefined, content: defaultSummary };

export const ACTION_TYPES = {
  SET_TARGET_DATE: 'TRACK_SUMMARY/ENTITIES/SUMMARY/SET_TARGET_DATE',
  FETCH_SUCCESS: 'TRACK_SUMMARY/ENTITIES/SUMMARY/FETCH_SUCCESS',
} as const;

type ActionTypes = typeof ACTION_TYPES;

type SetTargetDate = {
  type: ActionTypes['SET_TARGET_DATE'];
  payload: string;
};

type FetchSuccess = {
  type: ActionTypes['FETCH_SUCCESS'];
  payload: { summary: Summary; targetDate: string | undefined };
};

export const actions = {
  setTargetDate: (targetDate: string): SetTargetDate => ({
    type: ACTION_TYPES.SET_TARGET_DATE,
    payload: targetDate,
  }),

  fetchSuccess: (summary: Summary, targetDate?: string): FetchSuccess => ({
    type: ACTION_TYPES.FETCH_SUCCESS,
    payload: { summary, targetDate },
  }),
};

type Action = SetTargetDate | FetchSuccess;

export default function reducer(
  state: State = initialState,
  action: Action
): State {
  switch (action.type) {
    case ACTION_TYPES.SET_TARGET_DATE: {
      return {
        ...state,
        targetDate: (action as SetTargetDate).payload,
      };
    }

    case ACTION_TYPES.FETCH_SUCCESS: {
      const { summary, targetDate } = (action as FetchSuccess).payload;

      if (targetDate !== undefined && targetDate !== state.targetDate) {
        return state;
      }

      return {
        ...state,
        content: summary,
      };
    }

    default:
      return state;
  }
}
