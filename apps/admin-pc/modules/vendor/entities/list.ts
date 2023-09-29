import { Vendor } from '../../../../domain/models/exp/Vendor';

type State = Vendor[];

export const initialState: State = [];

// Actions

type Fetch = {
  type: 'ADMIN-PC/MODULES/VENDOR/ENTITIES/LIST/FETCH';
  payload: Vendor[];
};

type Action = Fetch;

export const FETCH: Fetch['type'] =
  'ADMIN-PC/MODULES/VENDOR/ENTITIES/LIST/FETCH';

export const actions = {
  fetch: (vendors: Vendor[] = []) => ({
    type: FETCH,
    payload: vendors,
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
