import {
  ORDER_TYPE,
  SortOrder,
} from '@apps/repositories/organization/attPattern/AttPatternListRepository';

import ROOT from './actionType';

import { Pattern } from './selectedPattern';

type State = {
  selectedTable: Pattern[];
  sortOrder: SortOrder;
};

export const initialState: State = {
  selectedTable: [],
  sortOrder: {
    field: 'code',
    order: ORDER_TYPE.ASC,
  },
};

// Actions
export const ACTION_TYPE = {
  SET_SELECTED_PATTERN: `${ROOT}/SELECTED_TABLE/SET_SELECTED_PATTERN`,
  ADD_SELECTED_PATTERN: `${ROOT}/SELECTED_TABLE/ADD_SELECTED_PATTERN`,
  DELETE_SELECTED_PATTERN: `${ROOT}/SELECTED_TABLE/DELETE_SELECTED_PATTERN`,
  SET_SORT_ORDER: `${ROOT}/SELECTED_TABLE/SET_SORT_ORDER`,
  RESET: `${ROOT}/SELECTED_TABLE/RESET`,
} as const;

type SetSelectedPattern = {
  type: typeof ACTION_TYPE.SET_SELECTED_PATTERN;
  payload: Pattern[];
};

type AddSelectedPattern = {
  type: typeof ACTION_TYPE.ADD_SELECTED_PATTERN;
  payload: Pattern;
};

type DeleteSelectedPattern = {
  type: typeof ACTION_TYPE.DELETE_SELECTED_PATTERN;
  payload: string;
};

type SetSortOrder = {
  type: typeof ACTION_TYPE.SET_SORT_ORDER;
  payload: SortOrder;
};

type Reset = {
  type: typeof ACTION_TYPE.RESET;
};

type Action =
  | SetSelectedPattern
  | AddSelectedPattern
  | DeleteSelectedPattern
  | SetSortOrder
  | Reset;

export const actions = {
  setSelectedPattern: (selectedPattern: Pattern[]): SetSelectedPattern => ({
    type: ACTION_TYPE.SET_SELECTED_PATTERN,
    payload: selectedPattern,
  }),
  addSelectedPattern: (selectedPattern: Pattern): AddSelectedPattern => ({
    type: ACTION_TYPE.ADD_SELECTED_PATTERN,
    payload: selectedPattern,
  }),
  deleteSelectedPattern: (code: string): DeleteSelectedPattern => ({
    type: ACTION_TYPE.DELETE_SELECTED_PATTERN,
    payload: code,
  }),
  setSortOrder: (sortOrder: SortOrder): SetSortOrder => ({
    type: ACTION_TYPE.SET_SORT_ORDER,
    payload: sortOrder,
  }),
  reset: (): Reset => ({
    type: ACTION_TYPE.RESET,
  }),
};

// Reducer

const sortPattern = (patterns: Pattern[], sortOrder: SortOrder) => {
  if (sortOrder.order === ORDER_TYPE.ASC) {
    return patterns.sort((a, b) =>
      a[sortOrder.field] > b[sortOrder.field] ? 1 : -1
    );
  } else if (sortOrder.order === ORDER_TYPE.DESC) {
    return patterns.sort((a, b) =>
      b[sortOrder.field] > a[sortOrder.field] ? 1 : -1
    );
  }
  return patterns;
};

export default (state: State = initialState, action: Action): State => {
  const { sortOrder } = state;
  switch (action.type) {
    case ACTION_TYPE.SET_SELECTED_PATTERN: {
      const selectedTable = (action as SetSelectedPattern).payload;
      return {
        ...state,
        selectedTable: sortPattern(selectedTable, sortOrder),
      };
    }

    case ACTION_TYPE.ADD_SELECTED_PATTERN: {
      const pattern = (action as AddSelectedPattern).payload;
      return {
        ...state,
        selectedTable: sortPattern(
          [...state.selectedTable, pattern],
          sortOrder
        ),
      };
    }

    case ACTION_TYPE.DELETE_SELECTED_PATTERN: {
      const code = (action as DeleteSelectedPattern).payload;
      return {
        ...state,
        selectedTable: sortPattern(
          state.selectedTable.filter((pattern) => pattern.code !== code),
          sortOrder
        ),
      };
    }

    case ACTION_TYPE.SET_SORT_ORDER: {
      const sortOrder = (action as SetSortOrder).payload;
      return {
        ...state,
        sortOrder,
        selectedTable: sortPattern([...state.selectedTable], sortOrder),
      };
    }

    case ACTION_TYPE.RESET:
      return initialState;

    default:
      return state;
  }
};
