import { bindActionCreators, Dispatch } from 'redux';

import moment from 'moment';

import configList from '../../constants/configList/job';
import { FunctionTypeList } from '../../constants/functionType';

import {
  catchApiError,
  confirm,
  loadingEnd,
  loadingStart,
} from '../../../commons/actions/app';
import msg from '../../../commons/languages';

import JobHistoryRepository from '@apps/repositories/organization/job/JobHistoryRepository';
import JobListRepository from '@apps/repositories/organization/job/JobListRepository';

import { Job } from '../../../domain/models/organization/Job';
import {
  defaultValue as defaultHistory,
  getClosest as getClosestHistoryRecord,
  JobHistory,
} from '@apps/domain/models/organization/JobHistory';

import {
  MODE as DETAIL_PANEL_MODE,
  setModeBase,
  setModeHistory,
  showDetailPane,
  showRevisionDialog as setRevisionDialog,
} from '../../modules/base/detail-pane/ui';
import { actions as BaseRecordActions } from '../../modules/job/entities/baseRecord';
import { actions as HistoryRecordActions } from '../../modules/job/entities/historyRecords';
import { actions as DetailActions } from '../../modules/job/ui/detail';

import { createJob, deleteJob, updateJob } from '../../actions/job';

import * as RecordUtil from '../../utils/RecordUtil';

import { AppDispatch } from '../AppThunk';
import { checkIsRequiredFieldFilled, startEditingBase } from '../Edit';

export { startEditingBase };

const App = (dispatch: AppDispatch) =>
  bindActionCreators({ loadingStart, loadingEnd, catchApiError }, dispatch);

export const setNewRecord =
  (sfObjFieldValues: { [key: string]: any }, targetDate?: string) =>
  (dispatch: Dispatch<any>) => {
    const baseRecord = RecordUtil.make(configList.base, sfObjFieldValues);
    const historyRecord = RecordUtil.make(
      configList.history || [],
      sfObjFieldValues
    );

    dispatch(DetailActions.setBaseRecord(baseRecord));
    dispatch(
      DetailActions.setHistoryRecord({
        ...historyRecord,
        validDateFrom: targetDate || moment().format('YYYY-MM-DD'),
      })
    );
  };

export const startEditingNewRecord =
  (
    sfObjFieldValues: {
      [key: string]: any;
    },
    targetDate?: string
  ) =>
  (dispatch: AppDispatch) => {
    dispatch(BaseRecordActions.initialize());
    dispatch(HistoryRecordActions.initialize());
    dispatch(DetailActions.initialize());
    dispatch(setNewRecord(sfObjFieldValues, targetDate));
    dispatch(showDetailPane(true));
    dispatch(setModeBase(DETAIL_PANEL_MODE.NEW));
    dispatch(setModeHistory(DETAIL_PANEL_MODE.NEW));
  };

export const startEditingHistory =
  ({ targetDate, comment }: { targetDate: string; comment: string }) =>
  (dispatch: AppDispatch) => {
    dispatch(
      DetailActions.setHistoryRecordByKeyValue('validDateFrom', targetDate)
    );
    dispatch(DetailActions.setHistoryRecordByKeyValue('comment', comment));
    dispatch(setRevisionDialog(false));
    dispatch(setModeBase(DETAIL_PANEL_MODE.VIEW));
    dispatch(setModeHistory(DETAIL_PANEL_MODE.REVISION));
  };

export const showRevisionDialog = () => (dispatch: Dispatch<any>) => {
  dispatch(setRevisionDialog(true));
  dispatch(setModeBase(DETAIL_PANEL_MODE.VIEW));
  dispatch(setModeHistory(DETAIL_PANEL_MODE.VIEW));
};

export const showDetail =
  (companyId: string, baseRecord: Job, targetDate: string) =>
  async (dispatch: Dispatch<any>): Promise<void> => {
    const app = App(dispatch);
    app.loadingStart();
    try {
      const { records } = await JobHistoryRepository.search({
        baseId: baseRecord.id,
      });
      const record = getClosestHistoryRecord(targetDate, records);

      dispatch(BaseRecordActions.fetch(baseRecord));
      dispatch(HistoryRecordActions.fetch(records));
      dispatch(DetailActions.setBaseRecord(baseRecord));
      dispatch(DetailActions.setHistoryRecord(record ?? defaultHistory));
      dispatch(DetailActions.selectHistory(record?.id ?? ''));
      dispatch(showDetailPane(true));
      dispatch(setModeBase(DETAIL_PANEL_MODE.VIEW));
      dispatch(setModeHistory(DETAIL_PANEL_MODE.VIEW));
    } catch (error) {
      app.catchApiError(new Error(msg().Admin_Msg_CannotFindRecord), {
        isContinuable: false,
      });
    } finally {
      app.loadingEnd();
    }
  };

export const fetchDetail =
  (companyId: string, baseRecordId: string, targetDate: string) =>
  async (dispatch: Dispatch<any>): Promise<void> => {
    const app = App(dispatch);
    app.loadingStart();
    try {
      const [base, { records: histories }] = await Promise.all([
        JobListRepository.getRecords([baseRecordId]),
        JobHistoryRepository.search({
          baseId: baseRecordId,
        }),
      ]);

      const history = getClosestHistoryRecord(targetDate, histories);
      dispatch(BaseRecordActions.fetch(base[0]));
      dispatch(DetailActions.setBaseRecord(base[0]));
      dispatch(HistoryRecordActions.fetch(histories));
      dispatch(DetailActions.setHistoryRecord(history));
      dispatch(DetailActions.selectHistory(history.id));
    } catch (error) {
      app.catchApiError(new Error(msg().Admin_Msg_CannotFindRecord), {
        isContinuable: false,
      });
    } finally {
      app.loadingEnd();
    }
  };

export const changeHistory =
  (value: string, historyRecordList: JobHistory[]) =>
  (dispatch: AppDispatch) => {
    const historyRecord =
      historyRecordList.find(({ id }) => id === value) || defaultHistory;
    dispatch(DetailActions.setHistoryRecord(historyRecord));
    dispatch(DetailActions.selectHistory(value));
  };

export const createRecord =
  (
    companyId: string,
    originalRecord: RecordUtil.Record,
    editingRecord: RecordUtil.Record,
    baseValueGetter: (arg0: string) => any,
    historyValueGetter: (arg0: string) => any,
    functionTypeList: FunctionTypeList
  ) =>
  async (dispatch: Dispatch<any>): Promise<boolean> => {
    const app = App(dispatch);
    try {
      app.loadingStart();

      const $editingRecord = {
        ...editingRecord,
        companyId,
      };

      const configListAll = [...configList.base, ...(configList.history || [])];
      const hasUninputRequiredValue = !dispatch(
        checkIsRequiredFieldFilled(
          configListAll,
          $editingRecord,
          functionTypeList,
          baseValueGetter,
          historyValueGetter
        )
      );

      if (hasUninputRequiredValue) {
        return false;
      }

      const record = RecordUtil.makeForRemote(
        configListAll,
        originalRecord,
        $editingRecord,
        functionTypeList,
        baseValueGetter,
        historyValueGetter
      );

      const { jobType: _, ...param }: any = {
        ...record,
        jobTypeId: record.jobType.id || null,
      };

      await dispatch(createJob(param));

      dispatch(DetailActions.initialize());
      dispatch(showDetailPane(false));
      dispatch(setModeBase(DETAIL_PANEL_MODE.VIEW));
      return true;
    } catch (err) {
      app.catchApiError(err);
    } finally {
      app.loadingEnd();
    }
    return false;
  };

export const updateBase =
  (
    companyId: string,
    originalBaseRecord: Job,
    editingBaseRecord: Job,
    baseValueGetter: (arg0: string) => any,
    functionTypeList: FunctionTypeList
  ) =>
  async (dispatch: Dispatch<any>): Promise<boolean> => {
    const app = App(dispatch);
    try {
      app.loadingStart();

      const $editingRecord = {
        ...editingBaseRecord,
        companyId,
      };

      const hasUninputRequiredValue = !dispatch(
        checkIsRequiredFieldFilled(
          configList.base,
          $editingRecord,
          functionTypeList,
          baseValueGetter,
          () => {}
        )
      );

      if (hasUninputRequiredValue) {
        return false;
      }

      const record = RecordUtil.makeForRemote(
        configList.base,
        originalBaseRecord,
        $editingRecord,
        functionTypeList,
        baseValueGetter,
        () => {}
      );

      await dispatch(updateJob(record));

      dispatch(showDetailPane(false));
      dispatch(setModeBase(DETAIL_PANEL_MODE.VIEW));
      dispatch(DetailActions.initialize());
      dispatch(BaseRecordActions.initialize());
      return true;
    } catch (err) {
      app.catchApiError(err);
    } finally {
      app.loadingEnd();
    }
    return false;
  };

export const updateHistory =
  (
    originalHistoryRecord: JobHistory,
    editingHistoryRecord: JobHistory,
    baseValueGetter: (arg0: string) => any,
    historyValueGetter: (arg0: string) => any,
    functionTypeList: FunctionTypeList,
    companyId: string
  ) =>
  async (dispatch: Dispatch<any>): Promise<boolean> => {
    const app = App(dispatch);
    try {
      app.loadingStart();

      const hasUninputRequiredValue = !dispatch(
        checkIsRequiredFieldFilled(
          configList.history || [],
          editingHistoryRecord,
          functionTypeList,
          baseValueGetter,
          historyValueGetter
        )
      );

      if (hasUninputRequiredValue) {
        return false;
      }

      const record = RecordUtil.makeForRemote(
        configList.history || [],
        originalHistoryRecord,
        editingHistoryRecord,
        functionTypeList,
        baseValueGetter,
        historyValueGetter
      );

      const { jobType: _, ...param }: any = {
        ...record,
        jobTypeId: record.jobType.id || null,
      };

      await JobHistoryRepository.create(param);

      await dispatch(
        fetchDetail(
          companyId,
          editingHistoryRecord.baseId,
          editingHistoryRecord.validDateFrom || ''
        )
      );
      dispatch(setModeBase(DETAIL_PANEL_MODE.VIEW));
      dispatch(setModeHistory(DETAIL_PANEL_MODE.VIEW));
      return true;
    } catch (err) {
      app.catchApiError(err);
    } finally {
      app.loadingEnd();
    }
    return false;
  };

export const removeBase =
  (baseId: string) =>
  async (dispatch: Dispatch<any>): Promise<boolean> => {
    const answer = await dispatch(confirm(msg().Exp_Msg_ConfirmDelete));
    if (!answer) {
      return false;
    }

    const app = App(dispatch);
    try {
      app.loadingStart();
      await dispatch(deleteJob({ id: baseId }));
      dispatch(showDetailPane(false));
      dispatch(setModeBase(DETAIL_PANEL_MODE.VIEW));
      return true;
    } catch (err) {
      app.catchApiError(err);
    } finally {
      app.loadingEnd();
    }
    return false;
  };

export const removeHistory =
  (historyId: string, baseId: string, targetDate: string) =>
  async (dispatch: Dispatch<any>): Promise<boolean> => {
    const answer = await dispatch(confirm(msg().Admin_Msg_ConfirmDelete));
    if (!answer) {
      return false;
    }

    const app = App(dispatch);
    try {
      app.loadingStart();
      await JobHistoryRepository.delete({ id: historyId });

      const { records } = await JobHistoryRepository.search({ baseId });
      dispatch(HistoryRecordActions.fetch(records));

      const historyRecord =
        getClosestHistoryRecord(targetDate, records) || defaultHistory;

      dispatch(DetailActions.setHistoryRecord(historyRecord));
      dispatch(DetailActions.selectHistory(historyRecord.id || ''));
      return true;
    } catch (err) {
      app.catchApiError(err);
    } finally {
      app.loadingEnd();
    }
    return false;
  };

export const hideDetail = () => (dispatch: Dispatch<any>) => {
  dispatch(BaseRecordActions.initialize());
  dispatch(DetailActions.initialize());
  dispatch(showDetailPane(false));
  dispatch(setModeBase(DETAIL_PANEL_MODE.VIEW));
};

export const cancelEditing =
  (baseRecord: Job, historyRecord: JobHistory) => (dispatch: Dispatch<any>) => {
    dispatch(setRevisionDialog(false));
    dispatch(DetailActions.setBaseRecord(baseRecord));
    dispatch(DetailActions.setHistoryRecord(historyRecord));
    dispatch(setModeBase(DETAIL_PANEL_MODE.VIEW));
    dispatch(setModeHistory(DETAIL_PANEL_MODE.VIEW));
  };

export const changeBaseRecordValue =
  (key: keyof Job, value: Job[keyof Job]) => (dispatch: Dispatch<any>) => {
    dispatch(DetailActions.setBaseRecordByKeyValue(key, value));
  };

export const changeHistoryRecordValue =
  (key: keyof JobHistory, value: JobHistory[keyof JobHistory]) =>
  (dispatch: Dispatch<any>) => {
    dispatch(DetailActions.setHistoryRecordByKeyValue(key, value));
  };
