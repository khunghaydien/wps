import { Reducer } from 'redux';

import {
  CustomEIOptionList,
  getCustomEIOptionList,
  getRecentlyUsedCustomEI,
} from '../../../../domain/models/exp/ExtendedItem';

import { AppDispatch } from '../AppThunk';

export const ACTIONS = {
  GET_SUCCESS: 'MODULES/EXPENSE/ENTITIES/CUSTOMEIOPTION/GET_SUCCESS',
  GET_RECENT_SUCCESS:
    'MODULES/EXPENSE/ENTITIES/CUSTOMEIOPTION/GET_RECENT_SUCCESS',
  SEARCH_SUCCESS: 'MODULES/EXPENSE/ENTITIES/CUSTOMEIOPTION/SEARCH_SUCCESS',
  SEARCH_WITH_TYPE_SUCCESS:
    'MODULES/EXPENSE/ENTITIES/CUSTOMEIOPTION/SEARCH_WITH_TYPE_SUCCESS',
};

const getSuccess = (body: CustomEIOptionList) => ({
  type: ACTIONS.GET_SUCCESS,
  payload: body,
});

const getRecentSuccess = (body: CustomEIOptionList) => ({
  type: ACTIONS.GET_RECENT_SUCCESS,
  payload: body,
});

type Action = { payload: CustomEIOptionList; type: string };

export const actions = {
  get:
    (extendedItemCustomId: string, query?: string) =>
    (dispatch: AppDispatch): Promise<Action> =>
      getCustomEIOptionList(extendedItemCustomId, query)
        .then((res) => dispatch(getSuccess(res)))
        .catch((err) => {
          throw err;
        }),

  getRecentlyUsed:
    (eiCustomId: string, eiLookupId: string, empId: string) =>
    (dispatch: AppDispatch): Promise<Action> =>
      getRecentlyUsedCustomEI(empId, eiLookupId, eiCustomId)
        .then((res) => dispatch(getRecentSuccess(res)))
        .catch((err) => {
          throw err;
        }),
};

const initialState = { records: [], hasMore: false };

export default ((state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.GET_RECENT_SUCCESS:
    case ACTIONS.GET_SUCCESS:
    case ACTIONS.SEARCH_SUCCESS:
    case ACTIONS.SEARCH_WITH_TYPE_SUCCESS:
      return action.payload;
    default:
      return state;
  }
}) as Reducer<CustomEIOptionList, any>;
