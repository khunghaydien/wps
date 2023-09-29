import { bindActionCreators } from 'redux';

import moment from 'moment';

import { FunctionTypeList } from '@admin-pc/constants/functionType';
import configList from '@admin-pc-v2/constants/configList/department';

import {
  catchApiError,
  confirm,
  loadingEnd,
  loadingStart,
} from '@apps/commons/actions/app';
import msg from '@apps/commons/languages';

import Repository from '@apps/repositories/organization/department/DepartmentDetailRepository';

import { ASSIGNMENT_TYPE } from '@admin-pc-v2/models/organization/Department';
import { MasterDepartmentBase } from '@apps/domain/models/organization/MasterDepartmentBase';
import {
  defaultValue as defaultHistoryRecord,
  getClosest as getClosestHistoryRecord,
  HierarchyDisplayObject,
  MasterDepartmentHistory,
} from '@apps/domain/models/organization/MasterDepartmentHistory';

import {
  MODE as DETAIL_PANEL_MODE,
  setModeBase,
  setModeHistory,
  showDetailPane,
  showRevisionDialog as setRevisionDialog,
} from '@admin-pc/modules/base/detail-pane/ui';
import { actions as BaseRecordActions } from '@admin-pc-v2/modules/department/entities/baseRecord';
import { actions as HistoryRecordListActions } from '@admin-pc-v2/modules/department/entities/historyRecordList';
import { actions as DetailActions } from '@admin-pc-v2/modules/department/ui/detail';

import { AppDispatch } from '@admin-pc/action-dispatchers/AppThunk';
import {
  checkIsRequiredFieldFilled,
  startEditingBase,
  startEditingCurrentHistory,
} from '@admin-pc/action-dispatchers/Edit';
import {
  createDepartment,
  createHistoryDepartment,
  deleteDepartment,
  deleteHistoryDepartment,
  updateDepartment,
  updateHistoryDepartment,
} from '@admin-pc/actions/department';

import * as RecordUtil from '@admin-pc/utils/RecordUtil';

export { startEditingBase, startEditingCurrentHistory };

const App = (dispatch: AppDispatch) =>
  bindActionCreators({ loadingStart, loadingEnd, catchApiError }, dispatch);

export const showRevisionDialog = () => (dispatch: AppDispatch) => {
  dispatch(setRevisionDialog(true));
  dispatch(setModeBase(DETAIL_PANEL_MODE.VIEW));
  dispatch(setModeHistory(DETAIL_PANEL_MODE.VIEW));
};

export const setNewRecord =
  (
    sfObjFieldValues: {
      [key: string]: unknown;
    },
    targetDate?: string
  ) =>
  (dispatch: AppDispatch) => {
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
      [key: string]: unknown;
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
  async (dispatch: AppDispatch): Promise<void> => {
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
  async (dispatch: AppDispatch): Promise<void> => {
    const app = App(dispatch);
    try {
      app.loadingStart();

      await dispatch(fetchDetail(companyId, baseId, targetDate));

      dispatch(showDetailPane(true));
      dispatch(setModeBase(DETAIL_PANEL_MODE.VIEW));
      dispatch(setModeHistory(DETAIL_PANEL_MODE.VIEW));
    } catch (err) {
      app.catchApiError(new Error(msg().Admin_Msg_CannotFindRecord), {
        isContinuable: false,
      });
    } finally {
      app.loadingEnd();
    }
  };

export const changeHistory =
  (value: string, historyRecordList: MasterDepartmentHistory[]) =>
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
    baseValueGetter: (arg0: string) => unknown,
    historyValueGetter: (arg0: string) => unknown,
    functionTypeList: FunctionTypeList
  ) =>
  async (dispatch: AppDispatch): Promise<boolean> => {
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

      await dispatch(createDepartment(record));

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
    originalBaseRecord: MasterDepartmentBase,
    editingBaseRecord: MasterDepartmentBase,
    baseValueGetter: (arg0: string) => unknown,
    historyValueGetter: (arg0: string) => unknown,
    functionTypeList: FunctionTypeList
  ) =>
  async (dispatch: AppDispatch): Promise<boolean> => {
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

      await dispatch(updateDepartment(record));

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

const isEmployee = (x) => x.assignmentType === ASSIGNMENT_TYPE.EMPLOYEE;

export const updateHistory =
  (
    originalHistoryRecord: MasterDepartmentHistory,
    editingHistoryRecord: MasterDepartmentHistory,
    baseValueGetter: (arg0: string) => unknown,
    historyValueGetter: (arg0: string) => unknown,
    functionTypeList: FunctionTypeList,
    companyId: string,
    isUpdate?: boolean
  ) =>
  async (dispatch: AppDispatch): Promise<boolean> => {
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
      const recordConverted = {
        ...record,
        managers: (record.managers || []).map((i) => ({
          assignmentType: i.assignmentType,
          hierarchyPatternId: i.hierarchyPatternId,
          ...(isEmployee(i)
            ? { empBaseId: i.empBaseId }
            : { positionId: i.positionId }),
          primary: i.primary || false,
        })),
      };

      const departmentAction = isUpdate
        ? updateHistoryDepartment
        : createHistoryDepartment;

      await dispatch(departmentAction(recordConverted));

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
  async (dispatch: AppDispatch): Promise<boolean> => {
    const answer = await dispatch(confirm(msg().Exp_Msg_ConfirmDelete));
    if (!answer) {
      return false;
    }

    const app = App(dispatch);
    try {
      app.loadingStart();
      await dispatch(deleteDepartment({ id: baseId }));
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
  async (dispatch: AppDispatch): Promise<boolean> => {
    const answer = await dispatch(confirm(msg().Admin_Msg_ConfirmDelete));
    if (!answer) {
      return false;
    }

    const app = App(dispatch);
    try {
      app.loadingStart();
      await dispatch(deleteHistoryDepartment({ id: historyId }));

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

export const hideDetail = () => (dispatch: AppDispatch) => {
  dispatch(BaseRecordActions.initialize());
  dispatch(HistoryRecordListActions.initialize());
  dispatch(DetailActions.initialize());
  dispatch(showDetailPane(false));
  dispatch(setModeBase(DETAIL_PANEL_MODE.VIEW));
  dispatch(setModeHistory(DETAIL_PANEL_MODE.VIEW));
};

export const cancelEditing =
  (baseRecord: MasterDepartmentBase, historyRecord: MasterDepartmentHistory) =>
  (dispatch: AppDispatch) => {
    dispatch(setRevisionDialog(false));
    dispatch(DetailActions.setBaseRecord(baseRecord));
    dispatch(DetailActions.setHistoryRecord(historyRecord));
    dispatch(setModeBase(DETAIL_PANEL_MODE.VIEW));
    dispatch(setModeHistory(DETAIL_PANEL_MODE.VIEW));
  };

export const changeBaseRecordValue =
  (
    key: keyof MasterDepartmentBase,
    value: MasterDepartmentBase[keyof MasterDepartmentBase]
  ) =>
  (dispatch: AppDispatch) => {
    dispatch(DetailActions.setBaseRecordByKeyValue(key, value));
  };

export const changeHistoryRecordValue =
  (
    key: keyof MasterDepartmentHistory,
    value: MasterDepartmentHistory[keyof MasterDepartmentHistory]
  ) =>
  (dispatch: AppDispatch) => {
    dispatch(DetailActions.setHistoryRecordByKeyValue(key, value));
  };

export const getChildDepartments =
  (orgPatternId: string, targetDate: string, deptId: string) =>
  async (dispatch: AppDispatch): Promise<HierarchyDisplayObject[]> => {
    const { getChildDepartments } = Repository;
    const app = App(dispatch);
    const showSpinner = !deptId;
    try {
      if (showSpinner) {
        app.loadingStart();
      }
      return await getChildDepartments(orgPatternId, targetDate, deptId);
    } catch (err) {
      app.catchApiError(err);
    } finally {
      if (showSpinner) {
        app.loadingEnd();
      }
    }
  };
