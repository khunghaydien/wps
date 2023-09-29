import {
  ORDER_TYPE,
  SortOrder,
} from '@apps/repositories/organization/attPattern/AttPatternListRepository';

import ROOT from './actionType';

type State = {
  selectedCode: string;
  total: number;
  offsetCodes: string[];
  hasMoreRecords: boolean;
  sortOrder: SortOrder;
};

export const initialState: State = {
  selectedCode: '',
  total: 0,
  offsetCodes: [],
  hasMoreRecords: false,
  sortOrder: {
    field: 'code',
    order: ORDER_TYPE.ASC,
  },
};

// Actions
export const ACTION_TYPE = {
  INIT: `${ROOT}/LIST/INITIALIZE`,
  SET_SELECTED_CODE: `${ROOT}/LIST/SET_SELECTED_CODE`,
  SET: `${ROOT}/LIST/SET`,
  SET_SORT_ORDER: `${ROOT}/LIST/SET_SORT_ORDER`,
  RESET_SELECTED_CODE: `${ROOT}/LIST/RESET_SELECTED_CODE`,
  RESET: `${ROOT}/LIST/RESET`,
  RESET_SORT_ORDER: `${ROOT}/LIST/RESET_SORT_ORDER`,
} as const;

type Initialize = {
  type: typeof ACTION_TYPE.INIT;
};

type SetSelectedCode = {
  type: typeof ACTION_TYPE.SET_SELECTED_CODE;
  payload: string;
};

type ResetSelectedCode = {
  type: typeof ACTION_TYPE.RESET_SELECTED_CODE;
};

type Set = {
  type: typeof ACTION_TYPE.SET;
  payload: {
    total: number;
    offsetCodes: string[];
    hasMoreRecords: boolean;
  };
};

type Reset = {
  type: typeof ACTION_TYPE.RESET;
};

type SetSortOrder = {
  type: typeof ACTION_TYPE.SET_SORT_ORDER;
  payload: SortOrder;
};

type ResetSortOrder = {
  type: typeof ACTION_TYPE.RESET_SORT_ORDER;
};

type Action =
  | Initialize
  | SetSelectedCode
  | ResetSelectedCode
  | Set
  | Reset
  | SetSortOrder
  | ResetSortOrder;

export const actions = {
  initialize: (): Initialize => ({
    type: ACTION_TYPE.INIT,
  }),
  setSelectedCode: (selectedCode: string): SetSelectedCode => ({
    type: ACTION_TYPE.SET_SELECTED_CODE,
    payload: selectedCode,
  }),
  set: (
    total: number,
    offsetCodes: string[],
    hasMoreRecords: boolean
  ): Set => ({
    type: ACTION_TYPE.SET,
    payload: {
      total,
      offsetCodes,
      hasMoreRecords,
    },
  }),
  setSortOrder: (sortOrder: SortOrder): SetSortOrder => ({
    type: ACTION_TYPE.SET_SORT_ORDER,
    payload: sortOrder,
  }),
  resetSelectedCode: (): ResetSelectedCode => ({
    type: ACTION_TYPE.RESET_SELECTED_CODE,
  }),
  reset: (): Reset => ({
    type: ACTION_TYPE.RESET,
  }),
  resetSortOrder: (): ResetSortOrder => ({
    type: ACTION_TYPE.RESET_SORT_ORDER,
  }),
};

// Reducer
export default (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case ACTION_TYPE.INIT: {
      return initialState;
    }
    case ACTION_TYPE.SET_SELECTED_CODE: {
      return {
        ...state,
        selectedCode: (action as SetSelectedCode).payload,
      };
    }
    case ACTION_TYPE.SET: {
      const { total, offsetCodes, hasMoreRecords } = (action as Set).payload;
      return {
        ...state,
        total,
        offsetCodes,
        hasMoreRecords,
      };
    }
    case ACTION_TYPE.SET_SORT_ORDER: {
      return {
        ...state,
        sortOrder: (action as SetSortOrder).payload,
      };
    }
    case ACTION_TYPE.RESET_SELECTED_CODE: {
      return {
        ...state,
        selectedCode: '',
      };
    }
    case ACTION_TYPE.RESET: {
      return {
        ...state,
        total: 0,
        offsetCodes: [],
      };
    }
    case ACTION_TYPE.RESET_SORT_ORDER: {
      return {
        ...state,
        sortOrder: initialState.sortOrder,
      };
    }
    default:
      return state;
  }
};
