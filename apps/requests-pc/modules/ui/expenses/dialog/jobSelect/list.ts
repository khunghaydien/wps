import { Reducer } from 'redux';

import {
  DEFAULT_LIMIT_NUMBER,
  JobList,
} from '../../../../../../domain/models/exp/Job';

export const ACTIONS = {
  SET: 'MODULES/REQUESTS/DIALOG/JOB_SELECT/LIST/SET',
  SET_SEARCH_RESULT: 'MODULES/REQUESTS/DIALOG/JOB_SELECT/LIST/SET_SEARCH',
  SET_RECENT: 'MODULES/REQUESTS/DIALOG/JOB_SELECT/LIST/SET_RECENT',
  CLEAR: 'MODULES/REQUEST/DIALOG/CLEAR',
};

type JobSelectList = Array<JobList>;

export const actions = {
  set: (jobSelectList: JobSelectList) => ({
    type: ACTIONS.SET,
    payload: jobSelectList,
  }),
  setSearchResult: (jobSearchList: JobList) => ({
    type: ACTIONS.SET_SEARCH_RESULT,
    payload: jobSearchList,
  }),
  setRecentResult: (costCenterRecentItems: JobList) => ({
    type: ACTIONS.SET_RECENT,
    payload: costCenterRecentItems,
  }),
  clear: () => ({
    type: ACTIONS.CLEAR,
  }),
};

type State = {
  hasMore: boolean;
  recentItems: JobSelectList;
  searchList: JobSelectList;
  selectionList: JobSelectList;
};

const initialState = {
  selectionList: [],
  searchList: [],
  recentItems: [],
  hasMore: false,
};

export default ((state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.SET:
      return { ...state, selectionList: action.payload };
    case ACTIONS.SET_SEARCH_RESULT:
      // if returned list size is 101, remove the last one.
      const searchList = action.payload.slice(0, DEFAULT_LIMIT_NUMBER);
      return {
        ...state,
        searchList,
        hasMore: action.payload.length > DEFAULT_LIMIT_NUMBER,
      };
    case ACTIONS.SET_RECENT:
      return { ...state, recentItems: action.payload };
    case ACTIONS.CLEAR:
      return initialState;
    default:
      return state;
  }
}) as Reducer<State, any>;
