import { bindActionCreators, Dispatch } from 'redux';

import moment from 'moment';

import configList from '../../constants/configList/employee';
import { FunctionTypeList } from '../../constants/functionType';

import {
  catchApiError,
  confirm,
  loadingEnd,
  loadingStart,
} from '../../../commons/actions/app';
import msg from '../../../commons/languages';

import Repository from '../../../repositories/organization/employee/EmployeeDetailRepository';

import { MasterEmployeeBase } from '../../../domain/models/organization/MasterEmployeeBase';
import {
  defaultValue as defaultHistoryRecord,
  getClosest as getClosestHistoryRecord,
  MasterEmployeeHistory,
} from '../../../domain/models/organization/MasterEmployeeHistory';
import * as User from '../../models/User';

import {
  MODE as DETAIL_PANEL_MODE,
  setModeBase,
  setModeHistory,
  showDetailPane,
  showRevisionDialog as setRevisionDialog,
} from '../../modules/base/detail-pane/ui';
import { actions as BaseRecordActions } from '../../modules/employee/entities/baseRecord';
import { actions as HistoryRecordListActions } from '../../modules/employee/entities/historyRecordList';
import { actions as UserListActions } from '../../modules/employee/entities/userList';
import { actions as DetailActions } from '../../modules/employee/ui/detail';

import {
  createEmployee,
  createHistoryEmployee,
  deleteEmployee,
  deleteHistoryEmployee,
  updateEmployee,
} from '../../actions/employee';

import * as RecordUtil from '../../utils/RecordUtil';

import { AppDispatch } from '../AppThunk';
import { checkIsRequiredFieldFilled, startEditingBase } from '../Edit';

export { startEditingBase };

const App = (dispatch: AppDispatch) =>
  bindActionCreators({ loadingStart, loadingEnd, catchApiError }, dispatch);

export const showRevisionDialog = () => (dispatch: Dispatch<any>) => {
  dispatch(setRevisionDialog(true));
  dispatch(setModeBase(DETAIL_PANEL_MODE.VIEW));
  dispatch(setModeHistory(DETAIL_PANEL_MODE.VIEW));
};

export const setNewRecord =
  (
    sfObjFieldValues: {
      [key: string]: any;
    },
    targetDate?: string
  ) =>
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
    dispatch(HistoryRecordListActions.initialize());
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

const fetchDetail =
  (companyId: string, baseId: string, targetDate: string) =>
  async (dispatch: Dispatch<any>): Promise<void> => {
    const [baseRecord, historyList] = await Promise.all([
      Repository.fetchBase(baseId),
      Repository.fetchHistories(baseId),
    ]);
    const historyRecord = getClosestHistoryRecord(targetDate, historyList);

    if (!historyRecord) {
      throw new Error();
    }

    dispatch(HistoryRecordListActions.fetch(historyList));
    dispatch(BaseRecordActions.fetch(baseRecord));
    dispatch(DetailActions.setBaseRecord(baseRecord));
    dispatch(DetailActions.setHistoryRecord(historyRecord));
    dispatch(DetailActions.setSelectedHistoryId(historyRecord.id || ''));
  };

export const showDetail =
  (companyId: string, baseId: string, targetDate: string) =>
  async (dispatch: Dispatch<any>): Promise<void> => {
    const app = App(dispatch);
    try {
      app.loadingStart();

      await dispatch(fetchDetail(companyId, baseId, targetDate));

      dispatch(showDetailPane(true));
      dispatch(setModeBase(DETAIL_PANEL_MODE.VIEW));
      dispatch(setModeHistory(DETAIL_PANEL_MODE.VIEW));
    } catch (err) {
      app.catchApiError(new Error("Can't find a record."), {
        isContinuable: false,
      });
    } finally {
      app.loadingEnd();
    }
  };

export const changeHistory =
  (value: string, historyRecordList: MasterEmployeeHistory[]) =>
  (dispatch: AppDispatch) => {
    const historyRecord =
      historyRecordList.find(({ id }) => id === value) || defaultHistoryRecord;
    dispatch(DetailActions.setHistoryRecord(historyRecord));
    dispatch(DetailActions.setSelectedHistoryId(value));
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

      await dispatch(createEmployee(record));

      dispatch(DetailActions.initialize());
      dispatch(showDetailPane(false));
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

export const updateBase =
  (
    companyId: string,
    originalBaseRecord: MasterEmployeeBase,
    editingBaseRecord: MasterEmployeeBase,
    baseValueGetter: (arg0: string) => any,
    historyValueGetter: (arg0: string) => any,
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
          historyValueGetter
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
        historyValueGetter
      );

      await dispatch(updateEmployee(record));

      dispatch(showDetailPane(false));
      dispatch(setModeBase(DETAIL_PANEL_MODE.VIEW));
      dispatch(setModeHistory(DETAIL_PANEL_MODE.VIEW));
      dispatch(DetailActions.initialize());
      dispatch(BaseRecordActions.initialize());
      dispatch(HistoryRecordListActions.initialize());
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
    originalHistoryRecord: MasterEmployeeHistory,
    editingHistoryRecord: MasterEmployeeHistory,
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

      await dispatch(createHistoryEmployee(record));

      await dispatch(
        fetchDetail(
          companyId,
          editingHistoryRecord.baseId || '',
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
      await dispatch(deleteEmployee({ id: baseId }));
      dispatch(showDetailPane(false));
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
      await dispatch(deleteHistoryEmployee({ id: historyId }));

      const historyList = await Repository.fetchHistories(baseId);
      const historyRecord =
        getClosestHistoryRecord(targetDate, historyList) ||
        defaultHistoryRecord;

      dispatch(HistoryRecordListActions.fetch(historyList));
      dispatch(DetailActions.setHistoryRecord(historyRecord));
      dispatch(DetailActions.setSelectedHistoryId(historyRecord.id || ''));
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
  dispatch(HistoryRecordListActions.initialize());
  dispatch(DetailActions.initialize());
  dispatch(showDetailPane(false));
  dispatch(setModeBase(DETAIL_PANEL_MODE.VIEW));
  dispatch(setModeHistory(DETAIL_PANEL_MODE.VIEW));
};

export const cancelEditing =
  (baseRecord: MasterEmployeeBase, historyRecord: MasterEmployeeHistory) =>
  (dispatch: Dispatch<any>) => {
    dispatch(setRevisionDialog(false));
    dispatch(DetailActions.setBaseRecord(baseRecord));
    dispatch(DetailActions.setHistoryRecord(historyRecord));
    dispatch(setModeBase(DETAIL_PANEL_MODE.VIEW));
    dispatch(setModeHistory(DETAIL_PANEL_MODE.VIEW));
  };

export const changeBaseRecordValue =
  (
    key: keyof MasterEmployeeBase,
    value: MasterEmployeeBase[keyof MasterEmployeeBase]
  ) =>
  (dispatch: Dispatch<any>) => {
    dispatch(DetailActions.setBaseRecordByKeyValue(key, value));
  };

export const changeHistoryRecordValue =
  (
    key: keyof MasterEmployeeHistory,
    value: MasterEmployeeHistory[keyof MasterEmployeeHistory]
  ) =>
  (dispatch: Dispatch<any>) => {
    dispatch(DetailActions.setHistoryRecordByKeyValue(key, value));
  };

export const searchUsers =
  (query: { name: string; userName: string; excludeLinked: boolean }) =>
  async (dispatch: AppDispatch) => {
    const app = App(dispatch);
    try {
      app.loadingStart();
      const records = await User.search(query);
      dispatch(UserListActions.fetchUsers(records));
    } catch (err) {
      app.catchApiError(err);
    } finally {
      app.loadingEnd();
    }
  };
