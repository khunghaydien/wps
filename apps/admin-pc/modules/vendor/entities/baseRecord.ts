import { defaultValue, Vendor } from '../../../../domain/models/exp/Vendor';

export type State = Vendor;

export const initialState: State = defaultValue;

// Actions

type Initialize = {
  type: 'ADMIN-PC/MODULES/VENDOR/ENTITIES/BASE_RECORD/INITIALIZE';
};

type Fetch = {
  type: 'ADMIN-PC/MODULES/VENDOR/ENTITIES/BASE_RECORD/FETCH';
  payload: Vendor;
};

type Action = Initialize | Fetch;

export const INITIALIZE: Initialize['type'] =
  'ADMIN-PC/MODULES/VENDOR/ENTITIES/BASE_RECORD/INITIALIZE';

export const FETCH: Fetch['type'] =
  'ADMIN-PC/MODULES/VENDOR/ENTITIES/BASE_RECORD/FETCH';

export const actions = {
  initialize: (): Initialize => ({
    type: INITIALIZE,
  }),
  fetch: (baseRecord: Vendor): Fetch => ({
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
