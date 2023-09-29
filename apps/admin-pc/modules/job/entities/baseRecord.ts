import { defaultValue, Job } from '../../../../domain/models/organization/Job';

export type State = Job;

export const initialState: State = defaultValue;

// Actions

type Initialize = {
  type: 'ADMIN-PC/MODULES/JOB/ENTITIES/BASE_RECORD/INITIALIZE';
};

type Fetch = {
  type: 'ADMIN-PC/MODULES/JOB/ENTITIES/BASE_RECORD/FETCH';
  payload: Job;
};

type Action = Initialize | Fetch;

export const INITIALIZE: Initialize['type'] =
  'ADMIN-PC/MODULES/JOB/ENTITIES/BASE_RECORD/INITIALIZE';

export const FETCH: Fetch['type'] =
  'ADMIN-PC/MODULES/JOB/ENTITIES/BASE_RECORD/FETCH';

export const actions = {
  initialize: (): Initialize => ({
    type: INITIALIZE,
  }),
  fetch: (baseRecord: Job): Fetch => ({
    type: FETCH,
    payload: baseRecord,
  }),
};

// Reducer
export default (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case INITIALIZE: {
      return initialState;
    }

    case FETCH: {
      return action.payload;
    }

    default:
      return state;
  }
};
