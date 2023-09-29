import { Job } from '../../../../domain/models/organization/Job';

type State = Job[];

export const initialState: State = [];

// Actions

type Fetch = {
  type: 'ADMIN-PC/MODULES/JOB/ENTITIES/LIST/FETCH';
  payload: Job[];
};

type Action = Fetch;

export const FETCH: Fetch['type'] = 'ADMIN-PC/MODULES/JOB/ENTITIES/LIST/FETCH';

export const actions = {
  fetch: (jobs: Job[] = []) => ({
    type: FETCH,
    payload: jobs,
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
