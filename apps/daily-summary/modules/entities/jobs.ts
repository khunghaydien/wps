import { Job } from '../../../domain/models/time-tracking/Job';

// State

export type State = Job[][];

const initialState = [];

// Action

type Clear = {
  type: '/DAILY-SUMMARY/ENTITIES/JOBS/CLEAR';
};

type FetchSuccess = {
  type: '/DAILY-SUMMARY/ENTITIES/JOBS/FETCH_SUCCESS';
  payload: {
    jobs: Job[][];
  };
};

const CLEAR = '/DAILY-SUMMARY/ENTITIES/JOBS/CLEAR';
const FETCH_SUCCESS = '/DAILY-SUMMARY/ENTITIES/JOBS/FETCH_SUCCESS';

type Action = Clear | FetchSuccess;

export const actions = {
  clear: (): Clear => ({
    type: CLEAR,
  }),

  fetchSuccess: (jobs: Job[][]): FetchSuccess => ({
    type: FETCH_SUCCESS,
    payload: {
      jobs,
    },
  }),
};

// Reducer

export default (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case CLEAR: {
      return [];
    }

    case FETCH_SUCCESS: {
      return action.payload.jobs;
    }

    default:
      return state;
  }
};
