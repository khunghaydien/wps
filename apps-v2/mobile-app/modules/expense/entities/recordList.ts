import { Reducer } from 'redux';

import _ from 'lodash';

import {
  clonePreRequestRecord,
  cloneRecord,
  deletePreRequestRecord,
  deleteRecord,
  getRecordList,
  Record,
  RecordCloneResponseType,
  RecordListSaveResponseType,
  savePreRequestRecord,
  saveRecord,
  saveRecordList,
} from '../../../../domain/models/exp/Record';

import { AppDispatch } from '../AppThunk';
import { actions as reportActions } from './report';

export const ACTIONS = {
  LIST_SUCCESS: 'MODULES/EXPENSE/ENTITIES/RECORD/LIST_SUCCESS',
  SAVE_SUCCESS: 'MODULES/EXPENSE/ENTITIES/RECORD/SAVE_SUCCESS',
  DELETE_SUCCESS: 'MODULES/EXPENSE/ENTITIES/RECORD/DELETE_SUCCESS',
};

const listSuccess = (recordList: Record[]) => {
  return {
    type: ACTIONS.LIST_SUCCESS,
    payload: recordList,
  };
};

const saveSuccess = (respones: any) => {
  return {
    type: ACTIONS.SAVE_SUCCESS,
    payload: respones,
  };
};

const deleteSuccess = (response: any) => {
  return {
    type: ACTIONS.DELETE_SUCCESS,
    payload: response,
  };
};

export const actions = {
  list:
    (
      empId: string,
      expTypeList?: Array<string>,
      startDate?: string,
      endDate?: string
    ) =>
    (dispatch: AppDispatch): Promise<{ payload: Record[]; type: string }> => {
      return getRecordList(empId, expTypeList, startDate, endDate).then(
        ({ records }: { records: Record[] }) => dispatch(listSuccess(records))
      );
    },
  save:
    (
      values: Record,
      reportId?: string,
      reportTypeId?: string,
      empId?: string,
      isRequest?: boolean
    ) =>
    (dispatch: AppDispatch): Promise<void | { payload: any; type: string }> => {
      return (
        isRequest
          ? savePreRequestRecord(values, reportId, reportTypeId, empId)
          : saveRecord(values, reportId, reportTypeId, empId)
      ).then(() => {
        if (values.reportId) {
          delete values.reportId;
          dispatch(reportActions.updateRecord(values));
        } else {
          dispatch(saveSuccess(values));
        }
      });
    },
  saveList:
    (records: Record[], reportId?: string, reportTypeId?: string) =>
    (): Promise<RecordListSaveResponseType> => {
      return saveRecordList(records, reportId, reportTypeId);
    },
  delete:
    (recordId: string, isRequest?: boolean, isUseCashAdvance?: boolean) =>
    (dispatch: AppDispatch): Promise<{ payload: any; type: string }> => {
      const recordIds = [recordId];
      const _ = undefined;
      return (
        isRequest
          ? deletePreRequestRecord(recordIds)
          : deleteRecord(recordIds, _, isUseCashAdvance)
      ).then((res: any) => dispatch(deleteSuccess(res)));
    },
  cloneRecord:
    (
      recordIds: Array<string>,
      numberOfDays?: number,
      targetDates?: Array<string>,
      empId?: string,
      isRequest?: boolean,
      isUseCashAdvance?: boolean
    ) =>
    (): Promise<RecordCloneResponseType> => {
      return (
        isRequest
          ? clonePreRequestRecord(recordIds, targetDates, numberOfDays, empId)
          : cloneRecord(
              recordIds,
              targetDates,
              numberOfDays,
              empId,
              isUseCashAdvance
            )
      ).then((result) => result);
    },
};

type State = Record[];

const initialState: State = [];

export default ((state: State = initialState, action) => {
  switch (action.type) {
    case ACTIONS.LIST_SUCCESS:
      return action.payload || [];
    case ACTIONS.SAVE_SUCCESS:
      const res = _.cloneDeep(state);

      const idx = _.findIndex(state, ['recordId', action.payload.recordId]);

      if (idx === -1) {
        res.push(action.payload);
      } else {
        res[idx] = action.payload;
      }

      return res;
    case ACTIONS.DELETE_SUCCESS:
      return action.payload;
    default:
      return state;
  }
}) as Reducer<Record[], any>;
