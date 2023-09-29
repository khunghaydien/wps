import { JobHistory } from '../../../../domain/models/organization/JobHistory';

export type State = JobHistory[];

export const initialState: State = [];

// Actions

type Initialize = {
  type: 'ADMIN-PC/MODULES/JOB/ENTITIES/HISTORY_RECORD/INITIALIZE';
};

type Fetch = {
  type: 'ADMIN-PC/MODULES/JOB/ENTITIES/HISTORY_RECORD/FETCH';
  payload: JobHistory[];
};

type Action = Initialize | Fetch;

export const INITIALIZE: Initialize['type'] =
  'ADMIN-PC/MODULES/JOB/ENTITIES/HISTORY_RECORD/INITIALIZE';

export const FETCH: Fetch['type'] =
  'ADMIN-PC/MODULES/JOB/ENTITIES/HISTORY_RECORD/FETCH';

export const actions = {
  initialize: (): Initialize => ({
    type: INITIALIZE,
  }),
  fetch: (records: JobHistory[]): Fetch => ({
    type: FETCH,
    payload: records,
  }),
} as const;

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
