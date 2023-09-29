import { Reducer } from 'redux';

import { cloneDeep } from 'lodash';

import {
  catchApiError,
  loadingEnd,
  loadingStart,
} from '@apps/commons/actions/app';
import { NAMESPACE_PREFIX } from '@commons/api';

import { getRequestDetail } from '@apps/domain/models/customRequest';
import { RequestDetail, Status } from '@apps/domain/models/customRequest/types';

import { AppDispatch } from '../../AppThunk';

const STATUS_FIELD_NAME = NAMESPACE_PREFIX + 'Status__c';
const RECORD_ACCESS_FIELD_NAME = NAMESPACE_PREFIX + 'RecordAccessId__c';

export const ACTIONS = {
  GET_SUCCESS: 'MODULES/CUSTOM_REQUEST/ENTITIES/REQUEST_DETAIL/GET_SUCCESS',
  UPDATE_STATUS_SUCCESS:
    'MODULES/CUSTOM_REQUEST/ENTITIES/REQUEST_DETAIL/UPDATE_STATUS_SUCCESS',
  CLEAR_SUCCESS: 'MODULES/CUSTOM_REQUEST/ENTITIES/REQUEST_DETAIL/CLEAR_SUCCESS',
};

const getSuccess = (payload: RequestDetail) => ({
  type: ACTIONS.GET_SUCCESS,
  payload: payload,
});
const updateStatusSuccess = (status: string) => ({
  type: ACTIONS.UPDATE_STATUS_SUCCESS,
  payload: status,
});
const clear = () => ({
  type: ACTIONS.CLEAR_SUCCESS,
});

export const actions = {
  get:
    (
      requestId: string,
      fieldsToSelect: Array<string>,
      includeFile: boolean,
      includeApprovalHistory: boolean
    ) =>
    (dispatch: AppDispatch) => {
      dispatch(loadingStart());
      return getRequestDetail(
        requestId,
        fieldsToSelect
          .filter((field) => field !== RECORD_ACCESS_FIELD_NAME && field)
          .concat([STATUS_FIELD_NAME]), // status is necessary for btn rendering
        includeFile,
        includeApprovalHistory
      )
        .then((res) => {
          dispatch(getSuccess(res));
          return res;
        })
        .catch((err) => dispatch(catchApiError(err, { isContinuable: true })))
        .finally(() => dispatch(loadingEnd()));
    },
  updateStatus: (status: Status) => (dispatch: AppDispatch) =>
    dispatch(updateStatusSuccess(status)),
  clear: () => (dispatch: AppDispatch) => dispatch(clear()),
};

const initialState = {} as RequestDetail;

export default ((state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.GET_SUCCESS:
      return action.payload;
    case ACTIONS.UPDATE_STATUS_SUCCESS:
      const newState = cloneDeep(state);
      newState.customRequest[STATUS_FIELD_NAME] = action.payload;
      return newState;
    case ACTIONS.CLEAR_SUCCESS:
      return initialState;
    default:
      return state;
  }
}) as Reducer<RequestDetail, any>;
