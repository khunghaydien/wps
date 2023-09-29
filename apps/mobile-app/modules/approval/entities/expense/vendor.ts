import { Dispatch, Reducer } from 'redux';

import {
  getVendorDetail,
  VendorItem,
} from '../../../../../domain/models/exp/Vendor';

export const ACTIONS = {
  GET_SUCCESS: 'MODULES/ENTITIES/APPROVAL/EXPENSE/VENDOR/GET_SUCCESS',
  CLEAR_SUCCESS: 'MODULES/ENTITIES/APPROVAL/EXPENSE/CLEAR_SUCCESS',
};

const getSuccess = (vendor: VendorItem) => ({
  type: ACTIONS.GET_SUCCESS,
  payload: vendor,
});

export const actions = {
  get:
    (id: string) =>
    (dispatch: Dispatch<any>): Promise<VendorItem> => {
      return getVendorDetail(id).then(({ records }) => {
        dispatch(getSuccess(records[0]));
        return records[0];
      });
    },
};

const initialState = null;

export default ((state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.GET_SUCCESS:
      return action.payload;
    case ACTIONS.CLEAR_SUCCESS:
      return initialState;
    default:
      return state;
  }
}) as Reducer<VendorItem | null | undefined, any>;
