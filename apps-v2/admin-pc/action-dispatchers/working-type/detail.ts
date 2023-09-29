import { Dispatch } from 'redux';

import { isEmpty } from 'lodash';
import moment from 'moment';

import configList from '../../constants/configList/workingType';
import { FunctionTypeList } from '../../constants/functionType';

import msg from '../../../commons/languages';
import { confirm } from '@commons/actions/app';
import { showToast } from '@commons/modules/toast';

import { SortOrder } from '@apps/repositories/organization/workingType/WorkingTypeRepository';

import {
  MODE,
  setModeBase,
  setModeHistory,
  showDetailPane,
  showRevisionDialog,
} from '../../modules/base/detail-pane/ui';
import { actions as UIListActions } from '../../modules/base/list-pane/ui/list';
import { actions as detailActions } from '../../modules/workingType/ui/detail';
import { actions as listActions } from '../../modules/workingType/ui/list';
import {
  actions as selectedPatternActions,
  Pattern,
} from '../../modules/workingType/ui/pattern/selectedPattern';

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
  updateHistoryWorkingType,
  updateWorkingType,
} from '../../actions/workingType';
import { AppDispatch } from '@apps/admin-pc/action-dispatchers/AppThunk';

import { State } from '@apps/admin-pc/reducers';

import * as RecordUtil from '../../utils/RecordUtil';

import { checkCharType, checkIsRequiredFieldFilled } from '../Edit';
import { search as searchList, SearchCondition } from './list';
import { closeDetailPanel } from './panel';

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
    dispatch(listActions.resetSelectedCode());
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
  (
    editRecord: RecordUtil.Record,
    editRecordHistory: RecordUtil.Record,
    patterns: Pattern[]
  ) =>
  (dispatch: Dispatch<any>) => {
    dispatch(showRevisionDialog(false));
    dispatch(setTmpEditRecord(editRecord));
    dispatch(setTmpEditRecordHistory(editRecordHistory));
    dispatch(selectedPatternActions.init(patterns));
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
    searchCondition: SearchCondition,
    sortOrder: SortOrder,
    chunkSize: number,
    isOverLimit: boolean,
    companyId: string
  ) =>
  async (dispatch: Dispatch<any>) => {
    const recordHistory = { ...tmpEditRecordHistory };
    if (!recordHistory.useExtendedItemAsDeviationReason) {
      recordHistory.useDeviationReasonText = true;
    }
    const orgRecord = {
      ...editRecord,
      ...(editRecordHistory || {}),
    };
    const newRecord = {
      ...tmpEditRecord,
      ...(recordHistory || {}),
      companyId,
    };
    const configListAll = [...configList.base, ...(configList.history || [])];
    const baseValueGetter = RecordUtil.getter(tmpEditRecord);
    const historyValueGetter = RecordUtil.getter(recordHistory);

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
      searchList(
        {
          ...searchCondition,
          companyId,
        },
        sortOrder,
        chunkSize,
        isOverLimit,
        false,
        true,
        true
      )
    );
  };

export const updateBase =
  (
    editRecord: RecordUtil.Record,
    tmpEditRecord: RecordUtil.Record,
    tmpEditRecordHistory: RecordUtil.Record,
    functionTypeList: FunctionTypeList,
    searchCondition: SearchCondition,
    sortOrder: SortOrder,
    chunkSize: number,
    isOverLimit: boolean,
    companyId: string,
    pagingConditon: {
      offsetCode: string;
      currentPage: number;
    }
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

    dispatch(UIListActions.setSelectedRowIndex(-1));

    dispatch(
      searchList(
        {
          ...searchCondition,
          companyId,
        },
        sortOrder,
        chunkSize,
        isOverLimit,
        false,
        true,
        true,
        pagingConditon
      )
    );
  };

export const appendHistory =
  (
    editRecordHistory: RecordUtil.Record,
    tmpEditRecord: RecordUtil.Record,
    tmpEditRecordHistory: RecordUtil.Record,
    functionTypeList: FunctionTypeList,
    condition: {
      searchCondition: SearchCondition;
      sortOrder: SortOrder;
      chunkSize: number;
      isOverLimit: boolean;
      changeSort: boolean;
      pagingCondition: { offsetCode: string; currentPage: number };
    }
  ) =>
  async (dispatch: AppDispatch) => {
    const baseValueGetter = RecordUtil.getter(tmpEditRecord);
    const recordHistory = { ...tmpEditRecordHistory };
    if (!recordHistory.useExtendedItemAsDeviationReason) {
      recordHistory.useDeviationReasonText = true;
    }
    const historyValueGetter = RecordUtil.getter(recordHistory);

    const hasUninputRequiredValue = !dispatch(
      checkIsRequiredFieldFilled(
        configList.history || [],
        recordHistory,
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
      recordHistory,
      functionTypeList,
      baseValueGetter,
      historyValueGetter
    );

    dispatch(createHistoryWorkingType(record)).then(() => {
      dispatch(closeDetailPanel());
      dispatch(showToast(msg().Admin_Lbl_SaveRevisionHistory));

      dispatch(
        searchList(
          condition.searchCondition,
          condition.sortOrder,
          condition.chunkSize,
          condition.isOverLimit,
          condition.changeSort,
          true,
          true,
          condition.pagingCondition
        )
      );
      dispatch(UIListActions.setSelectedRowIndex(-1));
    });
  };

export const updateHistory =
  (
    editRecordHistory: RecordUtil.Record,
    tmpEditRecord: RecordUtil.Record,
    tmpEditRecordHistory: RecordUtil.Record,
    functionTypeList: FunctionTypeList
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
  };

export const remove =
  (
    baseId: string,
    companyId: string,
    searchCondition: SearchCondition,
    sortOrder: SortOrder,
    chunkSize: number,
    isOverLimit: boolean
  ) =>
  async (dispatch: AppDispatch) => {
    const result = await dispatch(confirm(msg().Admin_Msg_ConfirmDelete));

    if (!result) {
      return;
    }

    dispatch(deleteWorkingType({ id: baseId })).then(() => {
      dispatch(UIListActions.setSelectedRowIndex(-1));
      dispatch(
        searchList(
          {
            ...searchCondition,
            companyId,
          },
          sortOrder,
          chunkSize,
          isOverLimit,
          false,
          true,
          true
        )
      );
    });
  };

export const removeHistory =
  (
    editRecordHistory: RecordUtil.Record,
    condition: {
      searchCondition: SearchCondition;
      sortOrder: SortOrder;
      chunkSize: number;
      isOverLimit: boolean;
      changeSort: boolean;
      pagingCondition: { offsetCode: string; currentPage: number };
    }
  ) =>
  async (dispatch: AppDispatch) => {
    const answer = await dispatch(confirm(msg().Admin_Msg_ConfirmDelete));
    if (!answer) {
      return;
    }

    await dispatch(deleteHistoryWorkingType({ id: editRecordHistory.id }));

    dispatch(showToast(msg().Admin_Lbl_DeleteRevisionHistory));

    dispatch(
      searchList(
        condition.searchCondition,
        condition.sortOrder,
        condition.chunkSize,
        condition.isOverLimit,
        condition.changeSort,
        true,
        false,
        condition.pagingCondition
      )
    );

    const historyList = await dispatch(
      searchHistoryWorkingType({
        baseId: editRecordHistory.baseId,
      })
    );

    const historyId = historyList[0].id;
    const history = historyList.find((item) => item.id === historyId);

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
  (key: string, value: any, charType?: string) =>
  async (dispatch: Dispatch<any>, getState) => {
    if (!checkCharType(charType, value)) {
      return;
    }

    if (key === 'attRecordExtendedItemSetId') {
      const defaultValue = (getState() as State).editRecordHistory[key];
      if (
        defaultValue &&
        !value &&
        !(await dispatch(
          confirm(msg().Att_Msg_ConfirmToDeleteRecordIfYouReleaseThisValue)
        ))
      ) {
        return;
      }
    }

    dispatch(setTmpEditRecordHistoryByKeyValue(key, value));
  };
