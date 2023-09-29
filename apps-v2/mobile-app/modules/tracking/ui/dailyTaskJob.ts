import { $PropertyType } from 'utility-types';

// State

export type State = {
  jobId: null | string;
  workCategoryId: null | string;
  taskTime: null | string;
};

const initialState = {
  jobId: null,
  workCategoryId: null,
  taskTime: '00:00',
};

// Action

type Update = {
  type: '/MOBILE-APP/MODULES/TRACKING/UI/DAILYTASKJOB/UPDATE';
  payload: {
    key: string;
    value: string;
  };
};

const UPDATE: $PropertyType<Update, 'type'> =
  '/MOBILE-APP/MODULES/TRACKING/UI/DAILYTASKJOB/UPDATE';

type Reset = {
  type: '/MOBILE-APP/MODULES/TRACKING/UI/DAILYTASKJOB/RESET';
};

const RESET: $PropertyType<Reset, 'type'> =
  '/MOBILE-APP/MODULES/TRACKING/UI/DAILYTASKJOB/RESET';

export const actions = {
  update: (key: string, value: string | null) => ({
    type: UPDATE,
    payload: {
      key,
      value,
    },
  }),

  reset: () => ({
    type: RESET,
  }),
};

type Action = Update | Reset;

// Reducer

export default (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case UPDATE: {
      const payload = (action as Update).payload;
      return {
        ...state,
        [payload.key]: payload.value,
      };
    }

    case RESET: {
      return initialState;
    }

    default:
      return state;
  }
};
