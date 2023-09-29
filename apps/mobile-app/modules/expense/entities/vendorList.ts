import { Reducer } from 'redux';

import {
  getRecentlyUsedVendor,
  getVendorList,
  VendorItem,
} from '@apps/domain/models/exp/Vendor';

import { AppDispatch } from '../AppThunk';

export const ACTIONS = {
  GET_SUCCESS: 'MODULES/EXPENSE/ENTITIES/VENDOR_LIST/GET_SUCCESS',
  GET_RECENT_SUCCESS: 'MODULES/EXPENSE/ENTITIES/VENDOR_LIST/GET_RECENT_SUCCESS',
};

const getSuccess = (body: VendorItem[]) => ({
  type: ACTIONS.GET_SUCCESS,
  payload: body,
});

const getRecentSuccess = (body: VendorItem[]) => ({
  type: ACTIONS.GET_RECENT_SUCCESS,
  payload: body,
});

type Action = { payload: VendorItem[]; type: string };

export const actions = {
  get:
    (extendedItemCustomId: string, query?: string) =>
    (dispatch: AppDispatch): Promise<Action> =>
      getVendorList(extendedItemCustomId, query)
        .then(({ records }) => dispatch(getSuccess(records)))
        .catch((err) => {
          throw err;
        }),

  getRecentlyUsed:
    (empBaseId: string) =>
    (dispatch: AppDispatch): Promise<Action> =>
      getRecentlyUsedVendor(empBaseId)
        .then(({ records }) => dispatch(getRecentSuccess(records)))
        .catch((err) => {
          throw err;
        }),
};

const initialState = [];

export default ((state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.GET_RECENT_SUCCESS:
    case ACTIONS.GET_SUCCESS:
      return action.payload;
    default:
      return state;
  }
}) as Reducer<VendorItem[], any>;
