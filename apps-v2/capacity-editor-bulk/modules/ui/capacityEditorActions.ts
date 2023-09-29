import { Reducer } from 'redux';

import _ from 'lodash';

import Api from '@apps/commons/api';

export const ACTIONS = {
  FETCH_SUCCESS: 'MODULES/UI/CAPACITY_EDITOR_ACTIONS/FETCH_SUCCESS',
};

type actionListType = {
  action: string;
  option: string;
  returnType: string;
};

export type capacityActions = {
  startDate: string;
  endDate: string;
  actionList: Array<actionListType>;
};

export function fetchCapacityAction(
  companyId: string
): Promise<capacityActions> {
  return Api.invoke({
    path: '/psa/capacity/actions/get',
    param: { companyId },
  });
}

export const fetchCapacityActionSuccess = (
  capacityActions: capacityActions
) => ({
  type: ACTIONS.FETCH_SUCCESS,
  payload: capacityActions,
});

const initialState: Array<capacityActions> = [];

export default ((state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.FETCH_SUCCESS:
      return action.payload;
    default:
      return state;
  }
}) as Reducer<any>;
