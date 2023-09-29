import { Dispatch } from 'redux';

import isEmpty from 'lodash/isEmpty';

import configList from '../../constants/configList/attendanceFeatureSetting';
import { FunctionTypeList } from '../../constants/functionType';

import msg from '../../../commons/languages';
import { catchBusinessError, confirm } from '@commons/actions/app';

import { AttOpsRecordAggregateSetting } from '@apps/admin-pc/models/attendance/AttOpsRecordAggregateSetting';

import { actions as detailActions } from '../../modules/attendanceFeatureSetting/ui/detail';
import { actions as listActions } from '../../modules/attendanceFeatureSetting/ui/list';
import {
  MODE,
  setModeBase,
  setModeHistory,
  showDetailPane,
  showRevisionDialog,
} from '../../modules/base/detail-pane/ui';

import {
  createFeatureSetting,
  createHistoryFeatureSetting,
  deleteHistoryFeatureSetting,
  searchFeatureSetting,
  searchHistoryFeatureSetting,
  updateFeatureSetting,
} from '../../actions/attendanceFeatureSetting';
import {
  setEditRecordHistory,
  setTmpEditRecord,
  setTmpEditRecordByKeyValue,
  setTmpEditRecordHistory,
  setTmpEditRecordHistoryByKeyValue,
} from '../../actions/editRecord';
import { AppDispatch } from '@apps/admin-pc/action-dispatchers/AppThunk';

import { getter, makeForRemote, Record } from '../../utils/RecordUtil';

import { checkCharType, checkIsRequiredFieldFilled } from '../Edit';
import { search as searchList } from './list';

export const create =
  (
    editRecord: Record,
    editRecordHistory: Record,
    tmpEditRecord: Record,
    tmpEditRecordHistory: Record,
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
    const baseValueGetter = getter(tmpEditRecord);
    const historyValueGetter = getter(tmpEditRecordHistory);

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

    const record = makeForRemote(
      configListAll,
      orgRecord,
      newRecord,
      functionTypeList,
      baseValueGetter,
      historyValueGetter
    );
    await dispatch(createFeatureSetting(record));

    dispatch(
      searchList({
        ...searchCondition,
        companyId,
      })
    );
  };

export const changeRecordValue =
  (key: string, value: any, charType?: string) => (dispatch: Dispatch<any>) => {
    if (!checkCharType(charType, value)) {
      return;
    }
    dispatch(setTmpEditRecordByKeyValue(key, value));
  };

export const startEditingBase =
  (editRecord: Record, editRecordHistory: Record) =>
  (dispatch: Dispatch<any>) => {
    dispatch(setTmpEditRecord(editRecord));
    dispatch(setTmpEditRecordHistory(editRecordHistory));
    dispatch(setModeBase(MODE.EDIT));
    dispatch(setModeHistory(MODE.VIEW));
  };

export const cancelEditing =
  (editRecord: Record, companyId: string) => async (dispatch: AppDispatch) => {
    const editRecordHistory = await dispatch(
      searchHistoryFeatureSetting({
        companyId,
      })
    );
    dispatch(showRevisionDialog(false));
    dispatch(setTmpEditRecord(editRecord));
    dispatch(
      detailActions.setTempOpsRecordAggregate(
        editRecordHistory[0].opsRecordAggregateSetting
      )
    );
    dispatch(setTmpEditRecordHistory(editRecordHistory[0]));
    dispatch(setModeBase(MODE.VIEW));
    dispatch(setModeHistory(MODE.VIEW));
  };

export const updateBase =
  (
    editRecord: Record,
    tmpEditRecord: Record,
    tmpEditRecordHistory: Record,
    functionTypeList: FunctionTypeList,
    searchCondition: { targetDate: string },
    companyId: string
  ) =>
  async (dispatch: Dispatch<any>) => {
    const baseValueGetter = getter(tmpEditRecord);
    const historyValueGetter = getter(tmpEditRecordHistory);

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

    const record = makeForRemote(
      configList.base,
      editRecord,
      tmpEditRecord,
      functionTypeList,
      baseValueGetter,
      historyValueGetter
    );
    await dispatch(updateFeatureSetting(record));

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

export const startEditingHistory =
  (historyRecord: Record) => (dispatch: Dispatch<any>) => {
    dispatch(setTmpEditRecordHistory(historyRecord));
    dispatch(
      detailActions.setTempOpsRecordAggregate(
        historyRecord.opsRecordAggregateSetting
      )
    );
    dispatch(showRevisionDialog(false));
    dispatch(setModeBase(MODE.VIEW));
    dispatch(setModeHistory(MODE.REVISION));
  };

export const changeRecordHistoryValue =
  (key: string, value: any, charType?: string) =>
  async (dispatch: Dispatch<any>) => {
    if (!checkCharType(charType, value)) {
      return;
    }
    dispatch(setTmpEditRecordHistoryByKeyValue(key, value));
  };

export const changeRecordfetatureByIndex =
  (index: number, key: keyof AttOpsRecordAggregateSetting, value: any) =>
  async (dispatch: Dispatch<any>) => {
    dispatch(detailActions.updateOpsRecordAggregate(index, key, value));
  };

export const removeHistory =
  (
    editRecordHistory: Record,
    searchCondition: { targetDate: string },
    companyId: string
  ) =>
  async (dispatch: AppDispatch) => {
    const answer = await dispatch(confirm(msg().Admin_Msg_ConfirmDelete));
    if (!answer) {
      return;
    }

    await dispatch(deleteHistoryFeatureSetting({ id: editRecordHistory.id }));

    const recordList = await dispatch(
      searchFeatureSetting({
        ...searchCondition,
        companyId,
      })
    );
    const historyList = await dispatch(
      searchHistoryFeatureSetting({
        companyId,
      })
    );

    const rowIdx = (recordList || []).findIndex(
      (item) => item.id === editRecordHistory.baseId
    );
    const historyId = historyList[0].id;
    const history = historyList.find((item) => item.id === historyId);

    if (rowIdx > -1) {
      dispatch(listActions.setSelectedCode(rowIdx));
    }
    dispatch(detailActions.setSelectedHistoryId(historyId));
    if (history) {
      dispatch(setEditRecordHistory(history));
      dispatch(
        detailActions.setTempOpsRecordAggregate(
          history.opsRecordAggregateSetting
        )
      );
    }
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
      dispatch(
        detailActions.setTempOpsRecordAggregate(
          history.opsRecordAggregateSetting
        )
      );
    }
  };

const formatDestination = (index: number) => {
  return msg().Admin_Lbl_AggregateItem + index.toString().padStart(3, '0');
};

export const appendHistory =
  (
    editRecordHistory: Record,
    tmpEditRecord: Record,
    tmpEditRecordHistory: Record,
    functionTypeList: FunctionTypeList,
    companyId: string,
    tempOpsRecordAggregate: AttOpsRecordAggregateSetting[]
  ) =>
  async (dispatch: AppDispatch) => {
    const baseValueGetter = getter(tmpEditRecord);
    const historyValueGetter = getter(tmpEditRecordHistory);

    let index = 0;
    for (let i = 0; i < tempOpsRecordAggregate.length; i++) {
      if (
        !isEmpty(tempOpsRecordAggregate[i]) &&
        isEmpty(tempOpsRecordAggregate[i].label)
      ) {
        tempOpsRecordAggregate[i].label = null;
      }
      if (
        !isEmpty(tempOpsRecordAggregate[i]) &&
        isEmpty(tempOpsRecordAggregate[i].fieldName)
      ) {
        tempOpsRecordAggregate[i].fieldName = null;
      }
      if (
        !isEmpty(tempOpsRecordAggregate[i]) &&
        isEmpty(tempOpsRecordAggregate[i].aggregateType)
      ) {
        tempOpsRecordAggregate[i].aggregateType = null;
      }
      if (
        isEmpty(tempOpsRecordAggregate[i]) ||
        (isEmpty(tempOpsRecordAggregate[i].label) &&
          isEmpty(tempOpsRecordAggregate[i].fieldName) &&
          isEmpty(tempOpsRecordAggregate[i].aggregateType))
      ) {
        tempOpsRecordAggregate[i] = {
          label: null,
          fieldName: null,
          aggregateType: null,
        };
      } else {
        index = i + 1;
      }
    }
    tempOpsRecordAggregate = tempOpsRecordAggregate.slice(0, index);
    const newRecord = {
      ...(tmpEditRecordHistory || {}),
      opsRecordAggregateSetting: tempOpsRecordAggregate,
      companyId,
    };

    let hasUninputRequiredValue = !dispatch(
      checkIsRequiredFieldFilled(
        configList.history || [],
        newRecord,
        functionTypeList,
        baseValueGetter,
        historyValueGetter
      )
    );

    if (hasUninputRequiredValue) {
      return;
    }

    let problem;
    tempOpsRecordAggregate.forEach((config, index) => {
      if (isEmpty(config.fieldName) || isEmpty(config.aggregateType)) {
        if (!(isEmpty(config.fieldName) && isEmpty(config.aggregateType))) {
          if (!config.fieldName) {
            problem =
              formatDestination(index + 1) +
              '：' +
              msg().Admin_Lbl_AggregateItem;
          }
          if (!config.aggregateType) {
            problem =
              formatDestination(index + 1) +
              '：' +
              msg().Admin_Lbl_AggregateType;
          }
          hasUninputRequiredValue = true;
        }
      }
    });

    if (hasUninputRequiredValue) {
      dispatch(
        catchBusinessError(
          msg().Admin_Lbl_ValidationCheck,
          problem,
          msg().Admin_Msg_EmptyItem
        )
      );
      return;
    }

    const record = makeForRemote(
      configList.history || [],
      editRecordHistory,
      newRecord,
      functionTypeList,
      baseValueGetter,
      historyValueGetter
    );
    await dispatch(createHistoryFeatureSetting(record));

    const historyList = await dispatch(
      searchHistoryFeatureSetting({
        companyId,
      })
    );

    const history =
      historyList.find(
        (item) => item.validDateFrom === tmpEditRecordHistory.validDateFrom
      ) || {};

    dispatch(setEditRecordHistory(history));
    dispatch(
      detailActions.setTempOpsRecordAggregate(history.opsRecordAggregateSetting)
    );
    dispatch(setModeBase(MODE.VIEW));
    dispatch(setModeHistory(MODE.VIEW));

    await dispatch(searchFeatureSetting({ companyId }));

    dispatch(detailActions.setSelectedHistoryId(history.id));
  };
