import { Reducer } from 'redux';

import { getCustomRequestList } from '@apps/domain/models/customRequest';
import {
  CustomRequestListEntity,
  CustomRequests,
} from '@apps/domain/models/customRequest/types';

import { AppDispatch } from '../../AppThunk';

export const ACTIONS = {
  SET_LOADING: 'MODULES/CUSTOM_REQUEST/ENTITIES/SET_LOADING',
  GET_SUCCESS: 'MODULES/CUSTOM_REQUEST/ENTITIES/GET_SUCCESS',
  CLEAR_SUCCESS: 'MODULES/CUSTOM_REQUEST/ENTITIES/CLEAR_SUCCESS',
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
      userId?: string,
      recordTypeId?: string,
      loadInBackground?: boolean
    ) =>
    (dispatch: AppDispatch) => {
      if (!loadInBackground) {
        dispatch(setLoading(true));
      }
      const searchCondition = `RecordTypeId='${recordTypeId}'${
        userId ? ` AND CreatedById='${userId}'` : ''
      }`;
      const fieldToSelectList = fieldsToSelect.filter((field) => field);
      return getCustomRequestList(sObjName, fieldToSelectList, searchCondition)
        .then((records) => {
          dispatch(getSuccess(records));
          return records;
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
