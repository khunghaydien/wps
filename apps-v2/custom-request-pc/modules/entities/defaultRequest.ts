import { Reducer } from 'redux';

import { getDefaultRequest } from '@apps/domain/models/customRequest';

import { AppDispatch } from '../AppThunk';

export const ACTIONS = {
  GET_SUCCESS: 'MODULES/ENTITIES/DEFAULT_REQUEST/GET_SUCCESS',
};

const getSuccess = (payload: Record<string, any>) => ({
  type: ACTIONS.GET_SUCCESS,
  payload,
});

export const actions = {
  get: (recordTypeId: string) => (dispatch: AppDispatch) => {
    return getDefaultRequest(recordTypeId)
      .then((res) => {
        dispatch(getSuccess(res.customRequest));
        return res.customRequest;
      })
      .catch((err) => {
        throw err;
      });
  },
};

const initialState = {};

// @ts-ignore
export default ((state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.GET_SUCCESS:
      return action.payload;
    default:
      return state;
  }
}) as Reducer<Record<string, string>, any>;
