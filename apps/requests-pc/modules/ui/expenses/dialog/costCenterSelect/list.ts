import { Reducer } from 'redux';

import {
  CostCenterList,
  DEFAULT_LIMIT_NUMBER,
} from '../../../../../../domain/models/exp/CostCenter';

export const ACTIONS = {
  SET: 'MODULES/EXPENSES/DIALOG/COST_CENTER_SELECT/LIST/SET',
  SET_SEARCH: 'MODULES/EXPENSES/DIALOG/COST_CENTER_SELECT/LIST/SET_SEARCH',
  SET_RECENT: 'MODULES/EXPENSES/DIALOG/COST_CENTER_SELECT/LIST/SET_RECENT',
  CLEAR: 'MODULES/REQUEST/DIALOG/CLEAR',
};

export const actions = {
  set: (costCenterSelectList: CostCenterList) => ({
    type: ACTIONS.SET,
    payload: costCenterSelectList,
  }),
  setSearchResult: (costCenterSearchList: CostCenterList) => ({
    type: ACTIONS.SET_SEARCH,
    payload: costCenterSearchList,
  }),
  setRecentResult: (costCenterRecentItems: CostCenterList) => ({
    type: ACTIONS.SET_RECENT,
    payload: costCenterRecentItems,
  }),
  clear: () => ({
    type: ACTIONS.CLEAR,
  }),
};

type State = {
  hasMore: boolean;
  recentItems: CostCenterList;
  searchList: CostCenterList;
  selectionList: CostCenterList;
};

const initialState = {
  selectionList: [],
  searchList: [],
  recentItems: [],
  hasMore: false,
};

/* Reducer */
export default ((state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.SET:
      return { ...state, selectionList: action.payload };
    case ACTIONS.SET_SEARCH:
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
