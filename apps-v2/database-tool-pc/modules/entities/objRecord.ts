import { Reducer } from 'redux';

import cloneDeep from 'lodash/cloneDeep';

import {
  MAX_RECORDS_NUMBER,
  RecordTableMode,
} from '../../constants/recordTable';

import {
  catchApiError,
  loadingEnd,
  loadingStart,
} from '../../../commons/actions/app';

import {
  Count,
  createObjRecords,
  deleteObjRecords,
  getObjRecords,
  getRecordsCount,
  Records,
  undeleteObjRecords,
  updateObjRecords,
} from '../../models/ObjectRecord';

import { AppDispatch } from '../AppThunk';
import { actions as recordDetailPageActions } from '../ui/recordDetail';
import { actions as recordListAction } from '../ui/recordList';
import { setDetailRecord } from './recordDetail';

export type State = {
  count: number;
  records: Array<Record<string, any>>;
};

const ACTIONS = {
  SET_COUNT: 'MODULES/ENTITIES/DB_TOOL/OBJ_RECORD/SET_COUNT',
  SET_RECORDS: 'MODULES/ENTITIES/DB_TOOL/OBJ_RECORD/SET_RECORDS',
  CLEAN_RECORDS: 'MODULES/ENTITIES/DB_TOOL/OBJ_RECORD/CLEAN_RECORDS',
};

export const setRecords = (records: Array<Record<string, any>>) => ({
  type: ACTIONS.SET_RECORDS,
  payload: records,
});

const setCount = (count: number) => ({
  type: ACTIONS.SET_COUNT,
  payload: count,
});

export const actions = {
  fetchRecordsCount:
    (
      sObjName: string,
      includeDeletedRecords: boolean,
      searchCondition?: string
    ) =>
    (dispatch: AppDispatch): Promise<any> => {
      dispatch(loadingStart());
      return getRecordsCount(sObjName, includeDeletedRecords, searchCondition)
        .then(({ count }: Count) => {
          dispatch(loadingEnd());
          dispatch(setCount(count));
          return count;
        })
        .catch((err: Error) => {
          dispatch(loadingEnd());
          dispatch(catchApiError(err, { isContinuable: true }));
        });
    },
  fetchObjRecords:
    (
      sObjName: string,
      fieldsToSelect: Array<string>,
      currentPage: number,
      includeDeletedRecords: boolean,
      recordNum: number,
      searchCondition?: string,
      sortCondition?: string
    ) =>
    (dispatch: AppDispatch): Promise<any> => {
      const promiseNum = Math.ceil(recordNum / MAX_RECORDS_NUMBER);
      const promiseSet = [];
      const offSet = (currentPage - 1) * recordNum;
      Array.from(Array(promiseNum), (_, i) => {
        const promise = getObjRecords(
          sObjName,
          fieldsToSelect,
          offSet + i * MAX_RECORDS_NUMBER,
          includeDeletedRecords,
          searchCondition,
          sortCondition
        );
        promiseSet.push(promise);
        return promiseSet;
      });
      dispatch(loadingStart());
      return Promise.all(promiseSet)
        .then((result) => {
          dispatch(loadingEnd());
          const records = [];
          result.forEach((list) => records.push(...list.records));
          dispatch(setRecords(records));
          dispatch(recordListAction.setFetchedRecords(records));
        })
        .catch((err: Error) => {
          dispatch(loadingEnd());
          dispatch(catchApiError(err, { isContinuable: true }));
        });
    },
  deleteRecord:
    (
      sObjName: string,
      recordIds: Array<string>,
      includeDeletedRecords: boolean,
      fieldsToSelect: Array<string>,
      searchCondition: string,
      sortCondition: string,
      currentPage: number
    ) =>
    (dispatch: AppDispatch): Promise<any> => {
      dispatch(loadingStart());
      return deleteObjRecords(sObjName, recordIds)
        .then(() => {
          Promise.all([
            getRecordsCount(sObjName, includeDeletedRecords, searchCondition),
            getObjRecords(
              sObjName,
              fieldsToSelect,
              (currentPage - 1) * 40,
              includeDeletedRecords,
              searchCondition,
              sortCondition
            ),
          ]).then(([{ count }, { records }]) => {
            dispatch(loadingEnd());
            dispatch(setCount(count));
            dispatch(setRecords(records));
            dispatch(recordListAction.setFetchedRecords(records));
            dispatch(recordListAction.setCheckboxList(true));
          });
        })
        .catch((err: Error) => {
          dispatch(loadingEnd());
          dispatch(catchApiError(err, { isContinuable: true }));
        });
    },
  undeleteRecord:
    (
      sObjName: string,
      recordIds: Array<string>,
      records: Array<Record<string, any>>
    ) =>
    (dispatch: AppDispatch): Promise<any> => {
      dispatch(loadingStart());
      return undeleteObjRecords(sObjName, recordIds)
        .then(() => {
          dispatch(loadingEnd());
          recordIds.forEach((id) => {
            const idx = records.findIndex((item) => item.Id === id);
            const record = Object.assign({}, records[idx], {
              IsDeleted: false,
            });
            records[idx] = record;
          });
          dispatch(setRecords(records));
          dispatch(recordListAction.setFetchedRecords(records));
          dispatch(recordListAction.setCheckboxList(true));
        })
        .catch((err: Error) => {
          dispatch(loadingEnd());
          dispatch(catchApiError(err, { isContinuable: true }));
        });
    },
  updateRecord:
    (
      sObjName: string,
      fieldTypeMap: Record<string, any>,
      editedRecords: Array<Record<string, any>>,
      records: Array<Record<string, any>>
    ) =>
    (dispatch: AppDispatch): Promise<any> => {
      dispatch(loadingStart());
      return updateObjRecords(sObjName, fieldTypeMap, editedRecords)
        .then(() => {
          dispatch(loadingEnd());
          dispatch(recordListAction.setMode(RecordTableMode.readOnly));
          dispatch(setRecords(records));
        })
        .catch((err: Error) => {
          dispatch(loadingEnd());
          dispatch(catchApiError(err, { isContinuable: true }));
        });
    },
  createRecord:
    (
      sObjName: string,
      fieldTypeMap: Record<string, any>,
      addedRecords: Array<Record<string, any>>,
      includeDeletedRecords: boolean,
      fieldsToSelect: Array<string>,
      searchCondition?: string,
      sortCondition?: string
    ) =>
    (dispatch: AppDispatch): Promise<any> => {
      dispatch(loadingStart());
      const addedData = addedRecords.map((record) => {
        delete record.Id;
        return record;
      });
      return createObjRecords(sObjName, fieldTypeMap, addedData)
        .then(() => {
          Promise.all([
            getRecordsCount(sObjName, includeDeletedRecords, searchCondition),
            getObjRecords(
              sObjName,
              fieldsToSelect,
              0,
              includeDeletedRecords,
              searchCondition,
              sortCondition
            ),
          ]).then(([{ count }, { records }]) => {
            dispatch(loadingEnd());
            dispatch(setCount(count));
            dispatch(setRecords(records));
            dispatch(recordListAction.setFetchedRecords(records));
            dispatch(recordListAction.setMode(RecordTableMode.readOnly));
          });
        })
        .catch((err: Error) => {
          dispatch(loadingEnd());
          dispatch(catchApiError(err, { isContinuable: true }));
        });
    },
  fetchObjRecordById:
    (sObjKey: string, fields: Array<string>, id: string) =>
    (dispatch: AppDispatch): Promise<any> => {
      dispatch(loadingStart());
      return getObjRecords(sObjKey, fields, 0, false, `id='${id}'`)
        .then(({ records }: Records) => {
          dispatch(setDetailRecord(records[0]));
          dispatch(
            recordDetailPageActions.setDetailRecord(
              sObjKey,
              cloneDeep(records[0])
            )
          );
          dispatch(loadingEnd());
        })
        .catch((err: Error) => {
          dispatch(loadingEnd());
          dispatch(catchApiError(err, { isContinuable: true }));
        });
    },
};

const initialState: State = {
  count: 0,
  records: [],
};

export default ((state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.SET_COUNT:
      return { ...state, count: action.payload };
    case ACTIONS.SET_RECORDS:
      return { ...state, records: action.payload };
    default:
      return state;
  }
}) as Reducer<State, any>;
