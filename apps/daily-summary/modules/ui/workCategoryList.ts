import merge from 'lodash/merge';
import omit from 'lodash/omit';

import { WorkCategory } from '../../../planner-pc/models/tracking/WorkCategory';

// State

type WorkCategoryId = WorkCategory['id'];

type WorkCategoryIdMapByJobId = {
  [jobId: string]: readonly WorkCategoryId[];
};

type State = Readonly<{
  [targetDate: string]: WorkCategoryIdMapByJobId;
}>;

export const initialState: State = {};

// Action

export const ADD = '/DAILY-SUMMARY/UI/WORK_CATEGORY_LIST/ADD';
export const CLEAR = '/DAILY-SUMMARY/UI/WORK_CATEGORY_LIST/CLEAR';

type Add = {
  type: '/DAILY-SUMMARY/UI/WORK_CATEGORY_LIST/ADD';
  payload: {
    targetDate: string;
    jobId: string;
    workCategoryIds: readonly WorkCategoryId[];
  };
};

type Clear = {
  type: '/DAILY-SUMMARY/UI/WORK_CATEGORY_LIST/CLEAR';
  payload?: {
    targetDate: string;
    jobId: string;
  };
};

type Action = Add | Clear;

export const actions = {
  add: (payload: Add['payload']): Add => ({
    type: ADD,
    payload,
  }),

  clear: (payload?: Clear['payload']): Clear => ({
    type: CLEAR,
    payload,
  }),
};

// Reducer

export default function reducer(
  state: State = initialState,
  action: Action
): State {
  switch (action.type) {
    case CLEAR: {
      if (action.payload) {
        return merge({}, state, {
          [action.payload.targetDate]: omit(state[action.payload.targetDate], [
            action.payload.jobId,
          ]),
        });
      } else {
        return initialState;
      }
    }
    case ADD: {
      return merge({}, state, {
        [action.payload.targetDate]: {
          [action.payload.jobId]: action.payload.workCategoryIds,
        },
      });
    }
    default: {
      return state;
    }
  }
}
