import { Reducer } from 'redux';

import {
  catchApiError,
  loadingEnd,
  loadingStart,
} from '../../../commons/actions/app';

import { updateObjRecords } from '../../models/ObjectRecord';

import { AppDispatch } from '../AppThunk';
import { actions as recordDetailActions } from '../ui/recordDetail';

const ACTIONS = {
  SET_RECORD: 'MODULES/ENTITIES/DB_TOOL/RECORD_DETAIL/SET_RECORD',
};

const setRecord = (record: Record<string, any>) => ({
  type: ACTIONS.SET_RECORD,
  payload: record,
});

export const setDetailRecord =
  (record: Record<string, any>) =>
  (dispatch: AppDispatch): void => {
    dispatch(setRecord(record));
  };

export const updateRecord =
  (
    sObjName: string,
    fieldTypeMap: Record<string, any>,
    editedData: Array<Record<string, any>>,
    record: Record<string, any>
  ) =>
  (dispatch: AppDispatch): Promise<any> => {
    dispatch(loadingStart());
    return updateObjRecords(sObjName, fieldTypeMap, editedData)
      .then(() => {
        dispatch(loadingEnd());
        dispatch(recordDetailActions.setEditMode(false));
        dispatch(setRecord(record));
      })
      .catch((err: Error) => {
        dispatch(loadingEnd());
        dispatch(catchApiError(err, { isContinuable: true }));
      });
  };

const initialState: Record<string, any> = {};

export default ((state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.SET_RECORD:
      return { ...action.payload };
    default:
      return state;
  }
}) as Reducer<Record<string, any>, any>;
