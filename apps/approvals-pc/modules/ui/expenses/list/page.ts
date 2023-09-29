import { Reducer } from 'redux';

export const ACTIONS = {
  SET: 'MODULES/UI/EXPENSES/LIST/PAGE/SET',
};

export const PAGE_SIZE = 10;
export const MAX_SEARCH_RESULT_NUM = 1000;
export const MAX_PAGE_NUM = MAX_SEARCH_RESULT_NUM / PAGE_SIZE;

export const actions = {
  set: (pageNum: number) => ({
    type: ACTIONS.SET,
    payload: pageNum,
  }),
};

const initialState = 1;

export default ((state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.SET:
      return action.payload;
    default:
      return state;
  }
}) as Reducer<number, any>;
