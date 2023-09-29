import { Reducer } from 'redux';

import _ from 'lodash';

import Api from '@apps/commons/api';

export const ACTIONS = {
  FETCH_SUCCESS: 'MODULES/UI/CAPACITY_EDITOR_WORK_ARRANGEMENTS/FETCH_SUCCESS',
};

type workArrangement = {
  id: string;
  code: string;
  companyId: string;
  name: string;
  name_L0: string | boolean;
  name_L1: string | boolean;
  name_L2: string | boolean;
  workTime: number;
};
type workArrangementArray = Array<workArrangement>;

export function fetchWorkArrangement(
  companyId: string
): Promise<workArrangementArray> {
  return Api.invoke({
    path: '/psa/work-arrangement/search',
    param: { companyId },
  });
}

export const fetchWorkArrangementSuccess = (
  workArrangementArray: workArrangementArray
) => ({
  type: ACTIONS.FETCH_SUCCESS,
  payload: workArrangementArray,
});

const initialState: workArrangementArray = [];

export default ((state: workArrangementArray = initialState, action) => {
  switch (action.type) {
    case ACTIONS.FETCH_SUCCESS:
      return action.payload;
    default:
      return state;
  }
}) as Reducer<any>;
