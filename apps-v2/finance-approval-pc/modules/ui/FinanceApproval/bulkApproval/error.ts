import { Reducer } from 'redux';

import { BulkError } from '@apps/domain/models/approval/request/Request';

export const ACTIONS = {
  SET: 'MODULES/UI/FINANCE_APPROVAL/BULK_APPROVAL/ERROR/SET',
  CLEAR: 'MODULES/UI/FINANCE_APPROVAL/BULK_APPROVAL/ERROR/CLEAR',
};

export const actions = {
  set: (errors: Array<BulkError>) => ({
    type: ACTIONS.SET,
    payload: errors,
  }),
  clear: () => ({
    type: ACTIONS.CLEAR,
  }),
};

const initialState = [];

export default ((state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.SET:
      return action.payload;
    case ACTIONS.CLEAR:
      return initialState;
    default:
      return state;
  }
}) as Reducer<Array<BulkError>, any>;
