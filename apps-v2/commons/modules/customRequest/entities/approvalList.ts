import { Reducer } from 'redux';

import { catchApiError, loadingEnd, loadingStart } from '@commons/actions/app';

import { getCustomRequestPendingList } from '@apps/domain/models/customRequest';
import {
  CUSTOM_REQUEST_APPROVAL_COLUMNS,
  CUSTOM_REQUEST_SF_OBJECT_NAME,
} from '@apps/domain/models/customRequest/consts';
import { CustomRequests } from '@apps/domain/models/customRequest/types';

import { AppDispatch } from '../../AppThunk';

export const ACTIONS = {
  GET_SUCCESS: 'MODULES/CUSTOM_REQUEST/ENTITIES/APPROVAL_LIST/GET_SUCCESS',
  CLEAR_SUCCESS: 'MODULES/CUSTOM_REQUEST/ENTITIES/APPROVAL_LIST/CLEAR_SUCCESS',
} as const;

type GetSuccess = {
  type: typeof ACTIONS.GET_SUCCESS;
  payload: CustomRequests;
};

type ClearSuccess = {
  type: typeof ACTIONS.CLEAR_SUCCESS;
};

export const actions = {
  list: () => (dispatch: AppDispatch) => {
    dispatch(loadingStart());

    const fieldsToSelect = Object.values(CUSTOM_REQUEST_APPROVAL_COLUMNS);
    return getCustomRequestPendingList(
      CUSTOM_REQUEST_SF_OBJECT_NAME,
      fieldsToSelect
    )
      .then((records) => {
        records.sort(
          (a, b) =>
            new Date(b.RequestTime__c).getTime() -
            new Date(a.RequestTime__c).getTime()
        );
        dispatch({
          type: ACTIONS.GET_SUCCESS,
          payload: records,
        });
      })
      .catch((err) => {
        dispatch(catchApiError(err));
      })
      .finally(() => {
        dispatch(loadingEnd());
      });
  },
  clear: () => ({
    type: ACTIONS.CLEAR_SUCCESS,
  }),
};

const initialState = [];

export default ((state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.GET_SUCCESS:
      return action.payload;
    case ACTIONS.CLEAR_SUCCESS:
      return initialState;
    default:
      return state;
  }
}) as Reducer<CustomRequests, GetSuccess | ClearSuccess>;
