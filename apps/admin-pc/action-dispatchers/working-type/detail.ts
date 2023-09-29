import { Dispatch } from 'redux';

import { isEmpty } from 'lodash';
import moment from 'moment';

import configList from '../../constants/configList/workingType';
import { FunctionTypeList } from '../../constants/functionType';

import { confirm } from '../../../commons/actions/app';
import msg from '../../../commons/languages';

import {
  MODE,
  setModeBase,
  setModeHistory,
  showDetailPane,
  showRevisionDialog,
} from '../../modules/base/detail-pane/ui';
import { actions as detailActions } from '../../modules/workingType/ui/detail';
import { actions as listActions } from '../../modules/workingType/ui/list';

import {
  setEditRecord,
  setEditRecordHistory,
  setTmpEditRecord,
  setTmpEditRecordByKeyValue,
  setTmpEditRecordHistory,
  setTmpEditRecordHistoryByKeyValue,
} from '../../actions/editRecord';
import { initializeHistory } from '../../actions/history';
import {
  createHistoryWorkingType,
  createWorkingType,
  deleteHistoryWorkingType,
  deleteWorkingType,
  searchHistoryWorkingType,
  searchWorkingType,
  updateHistoryWorkingType,
  updateWorkingType,
} from '../../actions/workingType';
import { AppDispatch } from '@apps/admin-pc/action-dispatchers/AppThunk';

import * as RecordUtil from '../../utils/RecordUtil';

import { checkCharType, checkIsRequiredFieldFilled } from '../Edit';
import { search as searchList } from './list';

const setNewRecord =
  (
    companyId: string,
    sfObjFieldValues: {
      [key: string]: any;
    },
    historyTargetDate?: string
  ) =>
  (dispatch: Dispatch<any>) => {
    const baseRecord = RecordUtil.make(configList.base, sfObjFieldValues);
    dispatch(setEditRecord({ ...baseRecord, companyId }));

    const historyRecord = RecordUtil.make(
      configList.history || [],
      sfObjFieldValues
    );
    dispatch(
      setEditRecordHistory({
        ...historyRecord,
        validDateFrom: historyTargetDate || moment().format('YYYY-MM-DD'),
      })
    );
  };

export const startEditingNewRecord =
  (
    companyId: string,
    sfObjFieldValues: {
      [key: string]: any;
    }
  ) =>
  (dispatch: Dispatch<any>) => {
    dispatch(setNewRecord(companyId, sfObjFieldValues));
    dispatch(initializeHistory());
    dispatch(showDetailPane(true));
    dispatch(setModeBase(MODE.NEW));
    dispatch(setModeHistory(MODE.NEW));
    dispatch(listActions.resetSelectedIndex());
  };

export const startEditingBase =
  (editRecord: RecordUtil.Record, editRecordHistory: RecordUtil.Record) =>
  (dispatch: Dispatch<any>) => {
    dispatch(setTmpEditRecord(editRecord));
    dispatch(setTmpEditRecordHistory(editRecordHistory));
    dispatch(setModeBase(MODE.EDIT));
    dispatch(setModeHistory(MODE.VIEW));
  };

export const startCloneEditingBase =
  (editRecord: RecordUtil.Record, editRecordHistory: RecordUtil.Record) =>
  (dispatch: Dispatch<any>) => {
    const clonedRecord = RecordUtil.clone(configList.base, editRecord);
    dispatch(setEditRecord(clonedRecord));
    if (!isEmpty(configList.history)) {
      editRecordHistory.comment = '';
      const clonedRecordHistory = RecordUtil.clone(
        configList.history,
        editRecordHistory
      );
      dispatch(setEditRecordHistory(clonedRecordHistory));
    }
    dispatch(showDetailPane(true));
    dispatch(setModeBase(MODE.CLONE));
    dispatch(setModeHistory(MODE.CLONE));
  };

export const startEditingHistory =
  (historyRecord: RecordUtil.Record) => (dispatch: Dispatch<any>) => {
    dispatch(setTmpEditRecordHistory(historyRecord));
    dispatch(showRevisionDialog(false));
    dispatch(setModeBase(MODE.VIEW));
    dispatch(setModeHistory(MODE.REVISION));
  };

export const cancelEditing =
  (editRecord: RecordUtil.Record, editRecordHistory: RecordUtil.Record) =>
  (dispatch: Dispatch<any>) => {
    dispatch(showRevisionDialog(false));
    dispatch(setTmpEditRecord(editRecord));
    dispatch(setTmpEditRecordHistory(editRecordHistory));
    dispatch(setModeBase(MODE.VIEW));
    dispatch(setModeHistory(MODE.VIEW));
  };

export const changeDisplayingHistory =
  (
    id: string,
    historyList: {
      [key: string]: any;
    }[]
  ) =>
  (dispatch: Dispatch<any>) => {
    dispatch(detailActions.setSelectedHistoryId(id));
    const history = historyList.find((item) => item.id === id);
    if (history) {
      dispatch(setEditRecordHistory(history));
    }
  };

export const create =
  (
    editRecord: RecordUtil.Record,
    editRecordHistory: RecordUtil.Record,
    tmpEditRecord: RecordUtil.Record,
    tmpEditRecordHistory: RecordUtil.Record,
    functionTypeList: FunctionTypeList,
    searchCondition: { targetDate: string },
    companyId: string
  ) =>
  async (dispatch: Dispatch<any>) => {
    const orgRecord = {
      ...editRecord,
      ...(editRecordHistory || {}),
    };
    const newRecord = {
      ...tmpEditRecord,
      ...(tmpEditRecordHistory || {}),
      companyId,
    };
    const configListAll = [...configList.base, ...(configList.history || [])];
    const baseValueGetter = RecordUtil.getter(tmpEditRecord);
    const historyValueGetter = RecordUtil.getter(tmpEditRecordHistory);

    const hasUninputRequiredValue = !dispatch(
      checkIsRequiredFieldFilled(
        configListAll,
        newRecord,
        functionTypeList,
        baseValueGetter,
        historyValueGetter
      )
    );
    if (hasUninputRequiredValue) {
      return;
    }

    const record = RecordUtil.makeForRemote(
      configListAll,
      orgRecord,
      newRecord,
      functionTypeList,
      baseValueGetter,
      historyValueGetter
    );
    await dispatch(createWorkingType(record));

    dispatch(
      searchList({
        ...searchCondition,
        companyId,
      })
    );
  };

export const updateBase =
  (
    editRecord: RecordUtil.Record,
    tmpEditRecord: RecordUtil.Record,
    tmpEditRecordHistory: RecordUtil.Record,
    functionTypeList: FunctionTypeList,
    searchCondition: { targetDate: string },
    companyId: string
  ) =>
  async (dispatch: Dispatch<any>) => {
    const baseValueGetter = RecordUtil.getter(tmpEditRecord);
    const historyValueGetter = RecordUtil.getter(tmpEditRecordHistory);

    const hasUninputRequiredValue = !dispatch(
      checkIsRequiredFieldFilled(
        configList.base,
        tmpEditRecord,
        functionTypeList,
        baseValueGetter,
        historyValueGetter
      )
    );

    if (hasUninputRequiredValue) {
      return;
    }

    const record = RecordUtil.makeForRemote(
      configList.base,
      editRecord,
      tmpEditRecord,
      functionTypeList,
      baseValueGetter,
      historyValueGetter
    );
    await dispatch(updateWorkingType(record));

    dispatch(showDetailPane(false));
    dispatch(setModeBase(MODE.VIEW));
    dispatch(setModeHistory(MODE.VIEW));

    dispatch(
      searchList({
        ...searchCondition,
        companyId,
      })
    );
  };

export const appendHistory =
  (
    editRecordHistory: RecordUtil.Record,
    tmpEditRecord: RecordUtil.Record,
    tmpEditRecordHistory: RecordUtil.Record,
    functionTypeList: FunctionTypeList,
    companyId: string
  ) =>
  async (dispatch: AppDispatch) => {
    const baseValueGetter = RecordUtil.getter(tmpEditRecord);
    const historyValueGetter = RecordUtil.getter(tmpEditRecordHistory);

    const hasUninputRequiredValue = !dispatch(
      checkIsRequiredFieldFilled(
        configList.history || [],
        tmpEditRecordHistory,
        functionTypeList,
        baseValueGetter,
        historyValueGetter
      )
    );

    if (hasUninputRequiredValue) {
      return;
    }

    const record = RecordUtil.makeForRemote(
      configList.history || [],
      editRecordHistory,
      tmpEditRecordHistory,
      functionTypeList,
      baseValueGetter,
      historyValueGetter
    );
    await dispatch(createHistoryWorkingType(record));

    const historyList = await dispatch(
      searchHistoryWorkingType({
        baseId: tmpEditRecordHistory.baseId,
      })
    );

    const history =
      historyList.find(
        (item) => item.validDateFrom === tmpEditRecordHistory.validDateFrom
      ) || {};

    dispatch(setEditRecordHistory(history));
    dispatch(setModeBase(MODE.VIEW));
    dispatch(setModeHistory(MODE.VIEW));

    await dispatch(searchWorkingType({ companyId }));

    dispatch(detailActions.setSelectedHistoryId(history.id));
  };

export const updateHistory =
  (
    editRecordHistory: RecordUtil.Record,
    tmpEditRecord: RecordUtil.Record,
    tmpEditRecordHistory: RecordUtil.Record,
    functionTypeList: FunctionTypeList,
    companyId: string
  ) =>
  async (dispatch: AppDispatch) => {
    const baseValueGetter = RecordUtil.getter(tmpEditRecord);
    const historyValueGetter = RecordUtil.getter(tmpEditRecordHistory);

    const hasUninputRequiredValue = !dispatch(
      checkIsRequiredFieldFilled(
        configList.history || [],
        tmpEditRecordHistory,
        functionTypeList,
        baseValueGetter,
        historyValueGetter
      )
    );

    if (hasUninputRequiredValue) {
      return;
    }

    const record = RecordUtil.makeForRemote(
      configList.history || [],
      editRecordHistory,
      tmpEditRecordHistory,
      functionTypeList,
      baseValueGetter,
      historyValueGetter
    );
    await dispatch(updateHistoryWorkingType(record));

    const historyList = await dispatch(
      searchHistoryWorkingType({
        baseId: tmpEditRecordHistory.baseId,
      })
    );

    const history =
      historyList.find((item) => item.id === tmpEditRecordHistory.id) || {};

    dispatch(setEditRecordHistory(history));
    dispatch(setModeBase(MODE.VIEW));
    dispatch(setModeHistory(MODE.VIEW));

    dispatch(searchWorkingType({ companyId }));
  };

export const remove =
  (
    baseId: string,
    companyId: string,
    searchCondition: { targetDate: string }
  ) =>
  async (dispatch: Dispatch<any>) => {
    const result = await dispatch(confirm(msg().Admin_Msg_ConfirmDelete));

    if (!result) {
      return;
    }

    await dispatch(deleteWorkingType({ id: baseId }));

    dispatch(
      searchList({
        ...searchCondition,
        companyId,
      })
    );
  };

export const removeHistory =
  (
    editRecordHistory: RecordUtil.Record,
    searchCondition: { targetDate: string },
    companyId: string
  ) =>
  async (dispatch: AppDispatch) => {
    const answer = await dispatch(confirm(msg().Admin_Msg_ConfirmDelete));
    if (!answer) {
      return;
    }

    await dispatch(deleteHistoryWorkingType({ id: editRecordHistory.id }));

    const recordList = await dispatch(
      searchWorkingType({
        ...searchCondition,
        companyId,
      })
    );
    const historyList = await dispatch(
      searchHistoryWorkingType({
        baseId: editRecordHistory.baseId,
      })
    );

    const rowIdx = (recordList || []).findIndex(
      (item) => item.id === editRecordHistory.baseId
    );
    const historyId = historyList[0].id;
    const history = historyList.find((item) => item.id === historyId);

    if (rowIdx > -1) {
      dispatch(listActions.setSelectedIndex(rowIdx));
    }
    dispatch(detailActions.setSelectedHistoryId(historyId));
    if (history) {
      dispatch(setEditRecordHistory(history));
    }
  };

export const changeRecordValue =
  (key: string, value: any, charType?: string) => (dispatch: Dispatch<any>) => {
    if (!checkCharType(charType, value)) {
      return;
    }
    dispatch(setTmpEditRecordByKeyValue(key, value));
  };

export const changeRecordHistoryValue =
  (key: string, value: any, charType?: string) => (dispatch: Dispatch<any>) => {
    if (!checkCharType(charType, value)) {
      return;
    }
    dispatch(setTmpEditRecordHistoryByKeyValue(key, value));
  };
