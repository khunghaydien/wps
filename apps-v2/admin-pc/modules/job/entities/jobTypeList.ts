import { JobType } from '../../../models/job-type/JobType';

type State = JobType[];

export const initialState: State = [];

// Actions

type Fetch = {
  type: 'ADMIN-PC/MODULES/JOB/ENTITIES/JOB_TYPE/LIST/FETCH';
  payload: JobType[];
};

type Clear = {
  type: 'ADMIN-PC/MODULES/JOB/ENTITIES/JOB_TYPE/LIST/CLEAR';
};

type Action = Fetch | Clear;

export const FETCH: Fetch['type'] =
  'ADMIN-PC/MODULES/JOB/ENTITIES/JOB_TYPE/LIST/FETCH';

export const CLEAR: Clear['type'] =
  'ADMIN-PC/MODULES/JOB/ENTITIES/JOB_TYPE/LIST/CLEAR';

export const actions = {
  fetchJobTypes: (jobTypes: JobType[] = []) => ({
    type: FETCH,
    payload: jobTypes,
  }),
  clear: () => ({
    type: CLEAR,
  }),
};

// Reducer

export default (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case FETCH: {
      return action.payload;
    }
    case CLEAR: {
      return initialState;
    }
    default:
      return state;
  }
};
