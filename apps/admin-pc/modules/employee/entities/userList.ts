import { User } from '../../../models/User';

type State = User[];

export const initialState: State = [];

// Actions

type Fetch = {
  type: 'ADMIN-PC/MODULES/EMPLOYEE/ENTITIES/USER/LIST/FETCH';
  payload: User[];
};

type Clear = {
  type: 'ADMIN-PC/MODULES/EMPLOYEE/ENTITIES/USER/LIST/CLEAR';
};

type Action = Fetch | Clear;

export const FETCH: Fetch['type'] =
  'ADMIN-PC/MODULES/EMPLOYEE/ENTITIES/USER/LIST/FETCH';

export const CLEAR: Clear['type'] =
  'ADMIN-PC/MODULES/EMPLOYEE/ENTITIES/USER/LIST/CLEAR';

export const actions = {
  fetchUsers: (users: User[] = []) => ({
    type: FETCH,
    payload: users,
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
