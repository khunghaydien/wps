import { Reducer } from 'redux';

import { SortBy } from '../../../../../domain/models/exp/FinanceApproval';

export const ACTIONS = {
  SET: 'MODULES/UI/EXPENSE/REQUESTLIST/SORT_BY/SET',
};

export const actions = {
  set: (sortBy: SortBy) => ({
    type: ACTIONS.SET,
    payload: sortBy,
  }),
};

const initialState = '';

export default ((state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.SET:
      return action.payload;
    default:
      return state;
  }
}) as Reducer<SortBy, any>;
