type State = string[];

export const initialState: State = [];

// Actions

type Fetch = {
  type: 'ADMIN-PC/MODULES/EMPLOYEE/ENTITIES/IDS/FETCH';
  payload: string[];
};

type Action = Fetch;

export const FETCH: Fetch['type'] =
  'ADMIN-PC/MODULES/EMPLOYEE/ENTITIES/IDS/FETCH';

export const actions = {
  fetch: (ids: string[] = []) => ({
    type: FETCH,
    payload: ids,
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
