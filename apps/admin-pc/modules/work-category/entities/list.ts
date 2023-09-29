import { WorkCategory } from '../../../../domain/models/time-tracking/WorkCategory';

type State = WorkCategory[];

export const initialState: State = [];

// Actions

type Fetch = {
  type: 'ADMIN-PC/MODULES/WORK_CATEGORY/ENTITIES/LIST/FETCH';
  payload: WorkCategory[];
};

type Action = Fetch;

export const FETCH: Fetch['type'] =
  'ADMIN-PC/MODULES/WORK_CATEGORY/ENTITIES/LIST/FETCH';

export const actions = {
  fetch: (workCategories: WorkCategory[] = []) => ({
    type: FETCH,
    payload: workCategories,
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
