import { Reducer } from 'redux';

import _ from 'lodash';

export const ACTIONS = {
  FETCH_SUCCESS: 'MODULES/ENTITIES/CAPACITY_COMPANY_INFO/FETCH_SUCCESS',
};

type companyInfo = { companyId?: string };

export const fetchSuccessAction = (companyId: string) => ({
  type: ACTIONS.FETCH_SUCCESS,
  payload: { companyId },
});

const initialState: companyInfo = {};

export default ((state: companyInfo = initialState, action) => {
  switch (action.type) {
    case ACTIONS.FETCH_SUCCESS:
      return action.payload;
    default:
      return state;
  }
}) as Reducer<any>;
