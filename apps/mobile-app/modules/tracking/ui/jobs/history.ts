import dropWhile from 'lodash/dropWhile';
import { $PropertyType } from 'utility-types';

import { Job } from '../../../../../domain/models/time-tracking/Job';

// State

export type State = {
  prev: Job | null | undefined;
  current: Job | null | undefined;
  parents: ReadonlyArray<Job>;
};

export const initialState = {
  prev: null,
  current: null,
  parents: [],
};

// Action

type Clear = {
  type: '/MOBILE-APP/MODULES/TRACKING/UI/JOBS/HISTORY/CLEAR';
};

type Go = {
  type: '/MOBILE-APP/MODULES/TRACKING/UI/JOBS/HISTORY/GO';
  payload: {
    parent: Job;
  };
};

type GoBack = {
  type: '/MOBILE-APP/MODULES/TRACKING/UI/JOBS/HISTORY/GO_BACK';
};

type Push = {
  type: '/MOBILE-APP/MODULES/TRACKING/UI/JOBS/HISTORY/PUSH';
  payload: {
    parent: Job | null | undefined;
  };
};

type Action = Clear | Go | GoBack | Push;

export const CLEAR: $PropertyType<Clear, 'type'> =
  '/MOBILE-APP/MODULES/TRACKING/UI/JOBS/HISTORY/CLEAR';

export const GO: $PropertyType<Go, 'type'> =
  '/MOBILE-APP/MODULES/TRACKING/UI/JOBS/HISTORY/GO';

export const GO_BACK: $PropertyType<GoBack, 'type'> =
  '/MOBILE-APP/MODULES/TRACKING/UI/JOBS/HISTORY/GO_BACK';

export const PUSH: $PropertyType<Push, 'type'> =
  '/MOBILE-APP/MODULES/TRACKING/UI/JOBS/HISTORY/PUSH';

export const actions = {
  go: (parent: Job): Go => ({
    type: GO,
    payload: {
      parent,
    },
  }),
  goBack: (): GoBack => ({
    type: GO_BACK,
  }),
  push: (parent: Job | null | undefined): Push => ({
    type: PUSH,
    payload: {
      parent,
    },
  }),
  clear: (): Clear => ({
    type: CLEAR,
  }),
};

// Reducer

export default (state: State = initialState, action: Action) => {
  switch (action.type) {
    case CLEAR: {
      return {
        ...initialState,
      };
    }

    case GO: {
      const { parent } = action.payload;
      const [current = null, prev = null, ...rest] = dropWhile(
        [...state.parents],
        ({ id }) => parent.id !== id
      );
      return {
        ...state,
        prev,
        current,
        parents: [
          ...(current === null ? [] : [current]),
          ...(prev === null ? [] : [prev]),
          ...(rest || []),
        ],
      };
    }

    case GO_BACK: {
      const [_head, current = null, prev = null, ...rest] = state.parents;
      return {
        ...state,
        prev,
        current,
        parents: [
          ...(current === null ? [] : [current]),
          ...(prev === null ? [] : [prev]),
          ...(rest || []),
        ],
      };
    }

    case PUSH: {
      return {
        ...state,
        prev: state.current,
        current: action.payload.parent,
        parents: [action.payload.parent, ...state.parents],
      };
    }

    default: {
      return state;
    }
  }
};
