import { $PropertyType } from 'utility-types';

import { WorkCategory } from '../../../../domain/models/time-tracking/WorkCategory';

// State

export type State = ReadonlyArray<WorkCategory>;

export const initialState: State = [];

// Action

type Clear = {
  type: '/MOBILE-APP/MODULES/TRACKING/ENTITY/WORK_CATEGORIES/CLEAR';
};

type FetchSuccess = {
  type: '/MOBILE-APP/MODULES/TRACKING/ENTITY/WORK_CATEGORIES/FETCH_SUCCESS';
  payload: ReadonlyArray<WorkCategory>;
};

export const CLEAR: $PropertyType<Clear, 'type'> =
  '/MOBILE-APP/MODULES/TRACKING/ENTITY/WORK_CATEGORIES/CLEAR';

export const FETCH_SUCCESS: $PropertyType<FetchSuccess, 'type'> =
  '/MOBILE-APP/MODULES/TRACKING/ENTITY/WORK_CATEGORIES/FETCH_SUCCESS';

export const actions = {
  clear: (): Clear => ({
    type: CLEAR,
  }),
  fetchSuccess: (
    workCategories: ReadonlyArray<WorkCategory>
  ): FetchSuccess => ({
    type: FETCH_SUCCESS,
    payload: workCategories,
  }),
};

type Action = Clear | FetchSuccess;

// Reducer

export default (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case CLEAR: {
      return initialState;
    }

    case FETCH_SUCCESS: {
      return [...action.payload];
    }

    default:
      return state;
  }
};
