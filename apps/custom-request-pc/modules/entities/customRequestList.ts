import { Reducer } from 'redux';

import { getCustomRequestList } from '@custom-request-pc/models';

import { AppDispatch } from '../AppThunk';
import {
  CustomRequestListEntity,
  CustomRequests,
} from '@custom-request-pc/types';

export const ACTIONS = {
  SET_LOADING: 'MODULES/ENTITIES/CUSTOM_REQUEST_LIST/SET_LOADING',
  GET_SUCCESS: 'MODULES/ENTITIES/CUSTOM_REQUEST_LIST/GET_SUCCESS',
  CLEAR_SUCCESS: 'MODULES/CLEAR_SUCCESS',
};

const setLoading = (isLoading: boolean) => ({
  type: ACTIONS.SET_LOADING,
  payload: isLoading,
});

const getSuccess = (res: CustomRequests) => ({
  type: ACTIONS.GET_SUCCESS,
  payload: res,
});

const clearSuccess = () => ({
  type: ACTIONS.CLEAR_SUCCESS,
});

export const actions = {
  list:
    (
      sObjName: string,
      fieldsToSelect: Array<string>,
      recordTypeId?: string,
      loadInBackground?: boolean
    ) =>
    (dispatch: AppDispatch) => {
      if (!loadInBackground) {
        dispatch(setLoading(true));
      }
      const searchCondition = `RecordTypeId='${recordTypeId}'`;
      return getCustomRequestList(sObjName, fieldsToSelect, searchCondition)
        .then((records) => {
          dispatch(getSuccess(records));
        })
        .catch((err) => {
          throw err;
        })
        .finally(() => {
          if (!loadInBackground) {
            dispatch(setLoading(false));
          }
        });
    },
  clear: () => (dispatch: AppDispatch) => dispatch(clearSuccess()),
};

const initialState = {
  list: [] as CustomRequests,
  isLoading: false,
};

export default ((state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.SET_LOADING:
      return { ...state, isLoading: action.payload };
    case ACTIONS.GET_SUCCESS:
      return { ...state, list: action.payload };
    case ACTIONS.CLEAR_SUCCESS:
      return initialState;
    default:
      return state;
  }
}) as Reducer<CustomRequestListEntity, any>;
