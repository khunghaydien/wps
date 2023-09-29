import { Reducer } from 'redux';

import { LayoutDetail } from '@apps/domain/models/customRequest/types';

import { AppDispatch } from '../AppThunk';

export const ACTIONS = {
  SET_SUCCESS: 'MODULES/UI/LAYOUT_DETAIL_INFO/SET_SUCCESS',
  CLEAR_SUCCESS: 'MODULES/CLEAR_SUCCESS',
};

const setSuccess = (payload: LayoutDetail) => ({
  type: ACTIONS.SET_SUCCESS,
  payload: payload,
});

export const actions = {
  set: (detail: LayoutDetail) => (dispatch: AppDispatch) => {
    dispatch(setSuccess(detail));
  },
};

const initialState = {} as LayoutDetail;

export default ((state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.SET_SUCCESS:
      return action.payload;
    case ACTIONS.CLEAR_SUCCESS:
      return initialState;
    default:
      return state;
  }
}) as Reducer<LayoutDetail, any>;
