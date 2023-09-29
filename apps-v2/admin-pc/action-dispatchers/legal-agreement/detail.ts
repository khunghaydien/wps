import { bindActionCreators } from 'redux';

import moment from 'moment';

import configList from '../../constants/configList/legalAgreement';
import limitConfigList from '../../constants/configList/legalAgreementRecord';
import specialConfigList from '../../constants/configList/legalAgreementSpecialRecord';
import { FunctionTypeList } from '../../constants/functionType';

import { confirm } from '@apps/commons/actions/app';
import msg from '@apps/commons/languages';

import {
  convertToLimitEvent,
  convertToSpecialEvent,
  LegalAgreementHistory,
} from '../../models/legal-agreement/LegalAgreement';

import {
  MODE,
  setModeBase,
  setModeHistory,
  showDetailPane,
} from '../../modules/base/detail-pane/ui';
import { actions as detailActions } from '../../modules/legalAgreement/ui/detail';
import { actions as listActions } from '../../modules/legalAgreement/ui/list';

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
  createHistoryLegalAgreement,
  createLegalAgreement,
  deleteHistoryLegalAgreement,
  deleteLegalAgreement,
  searchHistoryLegalAgreement,
  searchLegalAgreement,
  updateHistoryLegalAgreement,
  updateLegalAgreement,
} from '../../actions/legalAgreement';

import * as RecordUtil from '../../utils/RecordUtil';

import { AppDispatch } from '../AppThunk';
import { checkCharType, checkIsRequiredFieldFilled } from '../Edit';
import ListActions from './list';
import RevisionActions from './revisionDialog';

interface LegalAgreementDetailService {
  startEditingNewRecord: (
    companyId: string,
    sfObjFieldValues: {
      [key: string]: any;
    }
  ) => void;
  create: (
    editRecord: RecordUtil.Record,
    editRecordHistory: RecordUtil.Record,
    tmpEditRecord: RecordUtil.Record,
    tmpEditRecordHistory: RecordUtil.Record,
    functionTypeList: FunctionTypeList,
    searchCondition: { targetDate: string },
    companyId: string,
    event: RecordUtil.Record,
    specialEvent: RecordUtil.Record
  ) => Promise<void>;
  changeRecordValue: (key: string, value: any, charType?: string) => void;
  changeRecordHistoryValue: (
    key: string,
    value: any,
    charType?: string
  ) => void;
  updateBase: (
    editRecord: RecordUtil.Record,
    tmpEditRecord: RecordUtil.Record,
    tmpEditRecordHistory: RecordUtil.Record,
    functionTypeList: FunctionTypeList,
    searchCondition: { targetDate: string },
    companyId: string
  ) => void;
  appendHistory: (
    editRecordHistory: RecordUtil.Record,
    tmpEditRecord: RecordUtil.Record,
    tmpEditRecordHistory: RecordUtil.Record,
    functionTypeList: FunctionTypeList,
    companyId: string,
    event: RecordUtil.Record,
    specialEventRecord: RecordUtil.Record
  ) => Promise<void>;
  updateHistory: (
    editRecordHistory: RecordUtil.Record,
    tmpEditRecord: RecordUtil.Record,
    tmpEditRecordHistory: RecordUtil.Record,
    functionTypeList: FunctionTypeList,
    companyId: string
  ) => Promise<void>;
  remove: (
    baseId: string,
    companyId: string,
    searchCondition: { targetDate: string }
  ) => Promise<void>;
  removeHistory: (
    editRecordHistory: RecordUtil.Record,
    searchCondition: { targetDate: string },
    companyId: string
  ) => Promise<void>;
  startEditingBase: (
    editRecord: RecordUtil.Record,
    editRecordHistory: RecordUtil.Record
  ) => void;
  startEditingHistory: (historyRecord: RecordUtil.Record) => void;
  cancelEditing: (
    editRecord: RecordUtil.Record,
    editRecordHistory: RecordUtil.Record
  ) => void;
  changeDisplayingHistory: (
    id: string,
    historyList: {
      [key: string]: any;
    }[]
  ) => void;
}

export default (dispatch: AppDispatch): LegalAgreementDetailService => {
  const list = bindActionCreators(listActions, dispatch);
  const detail = bindActionCreators(detailActions, dispatch);
  const listDispatch = ListActions(dispatch);
  const revision = RevisionActions(dispatch);
  return {
    startEditingNewRecord: (
      companyId: string,
      sfObjFieldValues: {
        [key: string]: any;
      }
    ) => {
      const baseRecord = RecordUtil.make(configList.base, sfObjFieldValues);
      dispatch(setEditRecord({ ...baseRecord, companyId }));

      const historyRecord = RecordUtil.make(
        configList.history || [],
        sfObjFieldValues
      );
      dispatch(
        setEditRecordHistory({
          ...historyRecord,
          validDateFrom: moment().format('YYYY-MM-DD'),
        })
      );

      dispatch(initializeHistory());
      detail.setLimitEvent({});
      detail.setSpecialEvent({});
      dispatch(showDetailPane(true));
      dispatch(setModeBase(MODE.NEW));
      dispatch(setModeHistory(MODE.NEW));
      list.resetSelectedCode();
    },
    create: async (
      editRecord: RecordUtil.Record,
      editRecordHistory: RecordUtil.Record,
      tmpEditRecord: RecordUtil.Record,
      tmpEditRecordHistory: RecordUtil.Record,
      functionTypeList: FunctionTypeList,
      searchCondition: { targetDate: string },
      companyId: string,
      event: RecordUtil.Record,
      specialEvent: RecordUtil.Record
    ) => {
      const orgRecord = {
        ...editRecord,
        ...(editRecordHistory || {}),
      };
      const newRecord = {
        ...tmpEditRecord,
        ...(tmpEditRecordHistory || {}),
        ...event,
        ...specialEvent,
        companyId,
      };
      const configListAll = [
        ...configList.base,
        ...(configList.history || []),
        ...limitConfigList.base,
        ...specialConfigList.base,
      ];
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
      await dispatch(createLegalAgreement(record));

      listDispatch.search({
        ...searchCondition,
        companyId,
      });
    },
    changeRecordValue: (key: string, value: any, charType?: string) => {
      if (!checkCharType(charType, value)) {
        return;
      }
      dispatch(setTmpEditRecordByKeyValue(key, value));
    },
    changeRecordHistoryValue: (key: string, value: any, charType?: string) => {
      if (!checkCharType(charType, value)) {
        return;
      }
      dispatch(setTmpEditRecordHistoryByKeyValue(key, value));
    },
    updateBase: async (
      editRecord: RecordUtil.Record,
      tmpEditRecord: RecordUtil.Record,
      tmpEditRecordHistory: RecordUtil.Record,
      functionTypeList: FunctionTypeList,
      searchCondition: { targetDate: string },
      companyId: string
    ) => {
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
      await dispatch(updateLegalAgreement(record));

      dispatch(showDetailPane(false));
      dispatch(setModeBase(MODE.VIEW));
      dispatch(setModeHistory(MODE.VIEW));

      listDispatch.search({
        ...searchCondition,
        companyId,
      });
    },
    appendHistory: async (
      editRecordHistory: RecordUtil.Record,
      tmpEditRecord: RecordUtil.Record,
      tmpEditRecordHistory: RecordUtil.Record,
      functionTypeList: FunctionTypeList,
      companyId: string,
      event: RecordUtil.Record,
      specialEventRecord: RecordUtil.Record
    ) => {
      const baseValueGetter = RecordUtil.getter(tmpEditRecord);
      const historyValueGetter = RecordUtil.getter(tmpEditRecordHistory);
      const newRecord = {
        ...(tmpEditRecordHistory || {}),
        ...event,
        ...specialEventRecord,
        companyId,
      };
      const configListHistory = [
        ...(configList.history || []),
        ...limitConfigList.base,
        ...specialConfigList.base,
      ];
      const hasUninputRequiredValue = !dispatch(
        checkIsRequiredFieldFilled(
          configListHistory || [],
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
        configListHistory || [],
        editRecordHistory,
        newRecord,
        functionTypeList,
        baseValueGetter,
        historyValueGetter
      );
      await dispatch(createHistoryLegalAgreement(record));

      const historyList = await dispatch(
        searchHistoryLegalAgreement({
          baseId: tmpEditRecordHistory.baseId,
        })
      );

      const history =
        historyList.find(
          (item) => item.validDateFrom === tmpEditRecordHistory.validDateFrom
        ) || {};
      const limitEvent = convertToLimitEvent(history);
      const specialEvent = convertToSpecialEvent(history);

      dispatch(setEditRecordHistory(history));
      detail.setLimitEvent(limitEvent);
      detail.setSpecialEvent(specialEvent);
      dispatch(setModeBase(MODE.VIEW));
      dispatch(setModeHistory(MODE.VIEW));

      await dispatch(searchLegalAgreement({ companyId }));

      detail.setSelectedHistoryId(history.id);
    },
    updateHistory: async (
      editRecordHistory: RecordUtil.Record,
      tmpEditRecord: RecordUtil.Record,
      tmpEditRecordHistory: RecordUtil.Record,
      functionTypeList: FunctionTypeList,
      companyId: string
    ) => {
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
      await dispatch(updateHistoryLegalAgreement(record));

      const historyList = await dispatch(
        searchHistoryLegalAgreement({
          baseId: tmpEditRecordHistory.baseId,
        })
      );

      const history =
        historyList.find((item) => item.id === tmpEditRecordHistory.id) || {};
      const limitEvent = convertToLimitEvent(history);
      const specialEvent = convertToSpecialEvent(history);

      dispatch(setEditRecordHistory(history));
      detail.setLimitEvent(limitEvent);
      detail.setSpecialEvent(specialEvent);
      dispatch(setModeBase(MODE.VIEW));
      dispatch(setModeHistory(MODE.VIEW));

      dispatch(searchLegalAgreement({ companyId }));
    },
    remove: async (
      baseId: string,
      companyId: string,
      searchCondition: { targetDate: string }
    ) => {
      const result = await dispatch(confirm(msg().Admin_Msg_ConfirmDelete));

      if (!result) {
        return;
      }

      await dispatch(deleteLegalAgreement({ id: baseId }));

      listDispatch.search({
        ...searchCondition,
        companyId,
      });
    },
    removeHistory: async (
      editRecordHistory: RecordUtil.Record,
      searchCondition: { targetDate: string },
      companyId: string
    ) => {
      const answer = await dispatch(confirm(msg().Admin_Msg_ConfirmDelete));
      if (!answer) {
        return;
      }

      await dispatch(deleteHistoryLegalAgreement({ id: editRecordHistory.id }));

      const recordList = await dispatch(
        searchLegalAgreement({
          ...searchCondition,
          companyId,
        })
      );
      const historyList = await dispatch(
        searchHistoryLegalAgreement({
          baseId: editRecordHistory.baseId,
        })
      );

      const rowIdx = (recordList || []).findIndex(
        (item) => item.id === editRecordHistory.baseId
      );
      const historyId = historyList[0].id;
      const history = historyList.find((item) => item.id === historyId);

      if (rowIdx > -1) {
        list.setSelectedCode(rowIdx);
      }
      detail.setSelectedHistoryId(historyId);
      if (history) {
        const limitEvent = convertToLimitEvent(history);
        const specialEvent = convertToSpecialEvent(history);
        dispatch(setEditRecordHistory(history));
        detail.setLimitEvent(limitEvent);
        detail.setSpecialEvent(specialEvent);
      }
    },
    startEditingBase: (
      editRecord: RecordUtil.Record,
      editRecordHistory: RecordUtil.Record
    ) => {
      dispatch(setTmpEditRecord(editRecord));
      dispatch(setTmpEditRecordHistory(editRecordHistory));
      dispatch(setModeBase(MODE.EDIT));
      dispatch(setModeHistory(MODE.VIEW));
    },
    startEditingHistory: (historyRecord: RecordUtil.Record) => {
      dispatch(setTmpEditRecordHistory(historyRecord));
      revision.closeRevisionDialog();
      dispatch(setModeBase(MODE.VIEW));
      dispatch(setModeHistory(MODE.REVISION));
    },
    cancelEditing: (
      editRecord: RecordUtil.Record,
      editRecordHistory: RecordUtil.Record
    ) => {
      revision.closeRevisionDialog();
      dispatch(setTmpEditRecord(editRecord));
      dispatch(setTmpEditRecordHistory(editRecordHistory));
      dispatch(setModeBase(MODE.VIEW));
      dispatch(setModeHistory(MODE.VIEW));
    },
    changeDisplayingHistory: (
      id: string,
      historyList: LegalAgreementHistory[]
    ) => {
      detail.setSelectedHistoryId(id);
      const history = historyList.find((item) => item.id === id);
      if (history) {
        const limitEvent = convertToLimitEvent(history);
        const specialEvent = convertToSpecialEvent(history);
        dispatch(setEditRecordHistory(history));
        detail.setLimitEvent(limitEvent);
        detail.setSpecialEvent(specialEvent);
      }
    },
  };
};
