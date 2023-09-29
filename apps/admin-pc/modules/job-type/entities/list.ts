import { JobType } from '../../../models/job-type/JobType';

type State = JobType[];

export const initialState: State = [];

// Actions

type Fetch = {
  type: 'ADMIN-PC/MODULES/JOB_TYPE/ENTITIES/LIST/FETCH';
  payload: JobType[];
};

type Action = Fetch;

export const FETCH: Fetch['type'] =
  'ADMIN-PC/MODULES/JOB_TYPE/ENTITIES/LIST/FETCH';

export const actions = {
  fetch: (jobTypes: JobType[] = []) => ({
    type: FETCH,
    payload: jobTypes,
  }),
};

// Reducer

export default (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case FETCH: {
      return action.payload;
    }
    default:
      return state;
  }
};
