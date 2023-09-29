import { combineReducers } from 'redux';

import merge from 'lodash/merge';
import union from 'lodash/union';
import { normalize, schema } from 'normalizr';

import { WorkCategory } from '../../../../../../domain/models/time-tracking/WorkCategory';

// Schema

const workCategory = new schema.Entity<WorkCategory>('workCategories');
const workCategories = new schema.Array<WorkCategory>(workCategory);

// State

type WorkCategoryMapById = {
  [key: string]: WorkCategory;
};

type AllIds = readonly string[];

export type State = {
  byId: WorkCategoryMapById;
  allIds: AllIds;
};

export const initialState: State = {
  byId: {},
  allIds: [],
};

// Action

type Clear = {
  type: '/DAILY-SUMMARY/ENTITIES/WORK_CATEGORIES/CLEAR';
};

type FetchSuccess = {
  type: '/DAILY-SUMMARY/ENTITIES/WORK_CATEGORIES/FETCH_SUCCESS';
  payload: {
    entities: { workCategories: WorkCategoryMapById };
    result: AllIds;
  };
};

export const CLEAR = '/DAILY-SUMMARY/ENTITIES/WORK_CATEGORIES/CLEAR';
export const FETCH_SUCCESS =
  '/DAILY-SUMMARY/ENTITIES/WORK_CATEGORIES/FETCH_SUCCESS';

type Action = Clear | FetchSuccess;

export const actions = {
  clear: (): Clear => ({
    type: CLEAR,
  }),

  fetchSuccess: (data: readonly WorkCategory[]): FetchSuccess => ({
    type: FETCH_SUCCESS,
    payload: normalize(data, workCategories),
  }),
};

// Reducer

function workCategoryById(
  state: WorkCategoryMapById = initialState.byId,
  action: Action
): WorkCategoryMapById {
  switch (action.type) {
    case CLEAR: {
      return initialState.byId;
    }
    case FETCH_SUCCESS: {
      return merge({}, state, action.payload.entities.workCategories);
    }
    default: {
      return state;
    }
  }
}

function allWorkCategories(
  state: AllIds = initialState.allIds,
  action: Action
): AllIds {
  switch (action.type) {
    case CLEAR: {
      return initialState.allIds;
    }
    case FETCH_SUCCESS: {
      return union([], state, action.payload.result);
    }
    default: {
      return state;
    }
  }
}

export default combineReducers({
  byId: workCategoryById,
  allIds: allWorkCategories,
});
