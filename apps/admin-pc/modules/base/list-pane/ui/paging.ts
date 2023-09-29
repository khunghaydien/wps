import { PagingOptions } from '../../../../../commons/utils/PagingUtil';

type State = {
  current: number;
  limit: number;
  limitPerPage: number;
  isOverLimit: boolean;
};

export const initialState: State = {
  current: 0,
  limit: 0,
  limitPerPage: 0,
  isOverLimit: false,
};

// Actions

type Initialize = {
  type: 'ADMIN-PC/MODULES/BASE/LIST-PANE/UI/PAGING/INITIALIZE';
  payload: {
    paging: PagingOptions;
    isOverLimit: boolean;
  };
};

type SetCurrent = {
  type: 'ADMIN-PC/MODULES/BASE/LIST-PANE/UI/PAGING/SET';
  payload: number;
};

type Action = Initialize | SetCurrent;

export const INITIALIZE: Initialize['type'] =
  'ADMIN-PC/MODULES/BASE/LIST-PANE/UI/PAGING/INITIALIZE';

export const SET_CURRENT: SetCurrent['type'] =
  'ADMIN-PC/MODULES/BASE/LIST-PANE/UI/PAGING/SET';

export const actions = {
  initialize: (paging: PagingOptions, isOverLimit: boolean): Initialize => ({
    type: INITIALIZE,
    payload: {
      paging,
      isOverLimit,
    },
  }),
  setCurrent: (current: number): SetCurrent => ({
    type: SET_CURRENT,
    payload: current,
  }),
};

// Reducer

export default (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case INITIALIZE: {
      const { paging, isOverLimit } = action.payload;
      const { current, limit: $limit, limitPerPage } = paging;
      return {
        current,
        limit: $limit || 0,
        limitPerPage,
        isOverLimit,
      };
    }

    case SET_CURRENT: {
      const current = action.payload;
      return {
        ...state,
        current,
      };
    }

    default:
      return state;
  }
};
