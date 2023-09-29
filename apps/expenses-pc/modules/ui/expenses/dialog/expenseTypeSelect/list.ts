import { Reducer } from 'redux';

import cloneDeep from 'lodash/cloneDeep';
import find from 'lodash/find';
import sortBy from 'lodash/sortBy';

import {
  ExpenseType,
  ExpenseTypeList,
  ExpenseTypeListResult,
} from '../../../../../../domain/models/exp/ExpenseType';

export const ACTIONS = {
  SET: 'MODULES/EXPENSES/DIALOG/EXPENSE_TYPE_SELECT/LIST/SET',
  SET_SEARCH: 'MODULES/EXPENSES/DIALOG/EXPENSE_TYPE_SELECT/LIST/SET_SEARCH',
  SET_RECENT: 'MODULES/EXPENSES/DIALOG/EXPENSE_TYPE_SELECT/LIST/SET_RECENT',
  SET_FAVORITES:
    'MODULES/EXPENSES/DIALOG/EXPENSE_TYPE_SELECT/LIST/SET_FAVORITES',
  FAVORITE: 'MODULES/EXPENSES/DIALOG/EXPENSE_TYPE_SELECT/LIST/FAVORITE',
  UNFAVORITE: 'MODULES/EXPENSES/DIALOG/EXPENSE_TYPE_SELECT/LIST/UNFAVORITE',
  CLEAR: 'MODULES/EXPENSES/DIALOG/CLEAR',
};

export const actions = {
  set: (expenseTypeSelectList: ExpenseTypeList) => ({
    type: ACTIONS.SET,
    payload: expenseTypeSelectList,
  }),
  setSearchResult: (expenseTypeSelectList: ExpenseTypeListResult) => ({
    type: ACTIONS.SET_SEARCH,
    payload: expenseTypeSelectList,
  }),
  setRecentResult: (expenseTypeSelectList: ExpenseTypeList) => ({
    type: ACTIONS.SET_RECENT,
    payload: expenseTypeSelectList,
  }),
  setFavorites: (expenseTypes: ExpenseTypeList) => ({
    type: ACTIONS.SET_FAVORITES,
    payload: expenseTypes,
  }),
  favorite: (expType: ExpenseType) => ({
    type: ACTIONS.FAVORITE,
    payload: expType,
  }),
  unfavorite: (id: string) => ({
    type: ACTIONS.UNFAVORITE,
    payload: id,
  }),
  clear: () => ({
    type: ACTIONS.CLEAR,
  }),
};

// updated isFavorite in target expense type
const getUpdatedExpTypeList = (
  expTypeList: ExpenseTypeList,
  id: string,
  isFavorite: boolean
) => {
  const list = cloneDeep(expTypeList);
  const targetExpType = find(list, { id });
  if (targetExpType) {
    targetExpType.isFavorite = isFavorite;
  }
  return list;
};

//
// Reducer
//
type State = {
  favoriteItems?: ExpenseTypeList;
  hasMore: boolean;
  isLoading: boolean;
  recentItems: ExpenseTypeList;
  searchList: ExpenseTypeList;
  selectionList: ExpenseTypeList;
};

const initialState = {
  selectionList: [],
  searchList: [],
  recentItems: [],
  favoriteItems: null,
  hasMore: false,
  isLoading: false,
};

export default ((state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.SET:
      return { ...state, selectionList: action.payload };
    case ACTIONS.SET_SEARCH:
      return {
        ...state,
        searchList: action.payload.records,
        hasMore: action.payload.hasMore,
      };
    case ACTIONS.SET_RECENT:
      return { ...state, recentItems: action.payload };
    case ACTIONS.SET_FAVORITES:
      return { ...state, favoriteItems: action.payload };
    case ACTIONS.FAVORITE:
      const typeId = action.payload.id;
      const searchList = getUpdatedExpTypeList(state.searchList, typeId, true);
      const recentList = getUpdatedExpTypeList(state.recentItems, typeId, true);
      let favItemsCopy = cloneDeep(state.favoriteItems); // add newly favorite item to favorite list ONLY when the list is fetched once (not null)

      if (favItemsCopy && !find(favItemsCopy, { id: typeId })) {
        favItemsCopy.push({ ...action.payload, isFavorite: true });
        favItemsCopy = sortBy(favItemsCopy, 'code');
      }

      return {
        ...state,
        favoriteItems: favItemsCopy,
        searchList,
        recentItems: recentList,
      };
    case ACTIONS.UNFAVORITE:
      const id = action.payload;
      const searchItems = getUpdatedExpTypeList(state.searchList, id, false);
      const recentItems = getUpdatedExpTypeList(state.recentItems, id, false);
      let favoriteItems = cloneDeep(state.favoriteItems); // if list is null keep it as it is; otherwise filter

      favoriteItems = favoriteItems
        ? favoriteItems.filter((item) => item.id !== id)
        : favoriteItems;
      return {
        ...state,
        favoriteItems,
        searchList: searchItems,
        recentItems,
      };
    case ACTIONS.CLEAR:
      return initialState;
    default:
      return state;
  }
}) as Reducer<State, any>;
