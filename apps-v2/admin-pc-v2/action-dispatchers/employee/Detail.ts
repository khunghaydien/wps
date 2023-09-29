import { bindActionCreators, Dispatch } from 'redux';

import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';

import { FunctionTypeList } from '@admin-pc/constants/functionType';
import configList from '@admin-pc-v2/constants/configList/employee';
import configListResign from '@admin-pc-v2/constants/configList/employeeResign';

import DateUtil from '../../../commons/utils/DateUtil';
import {
  catchApiError,
  confirm,
  loadingEnd,
  loadingStart,
} from '@apps/commons/actions/app';
import msg from '@apps/commons/languages';

import DeptRepository, {
  SearchQuery as DeptSearchQuery,
} from '@apps/repositories/organization/department/DepartmentListRepository';
import Repository, {
  REVISION_TYPE_V2,
} from '@apps/repositories/organization/employee/EmployeeDetailRepository';

import * as User from '@admin-pc/models/User';
import { MasterEmployeeBase } from '@apps/domain/models/organization/MasterEmployeeBase';
import {
  defaultValue as defaultHistoryRecord,
  getClosest as getClosestHistoryRecord,
  MasterEmployeeHistory,
} from '@apps/domain/models/organization/MasterEmployeeHistory';

import {
  MODE as DETAIL_PANEL_MODE,
  setModeBase,
  setModeHistory,
  showDetailPane,
  showRevisionDialog as setRevisionDialog,
} from '@admin-pc/modules/base/detail-pane/ui';
import { actions as BaseRecordActions } from '@admin-pc/modules/employee/entities/baseRecord';
import { actions as HistoryRecordListActions } from '@admin-pc/modules/employee/entities/historyRecordList';
import { actions as UserListActions } from '@admin-pc/modules/employee/entities/userList';
import { actions as DetailActions } from '@admin-pc/modules/employee/ui/detail';

import { AppDispatch } from '@admin-pc/action-dispatchers/AppThunk';
import {
  checkIsRequiredFieldFilled,
  startEditingBase,
  startEditingCurrentHistory,
} from '@admin-pc/action-dispatchers/Edit';
import {
  createEmployee,
  createHistoryEmployee,
  deleteEmployee,
  deleteHistoryEmployee,
  updateEmployee,
  updateHistoryEmployee,
} from '@admin-pc/actions/employee';
import { addSubRoleEmployee } from '@admin-pc-v2/actions/employee';

import * as RecordUtil from '@admin-pc/utils/RecordUtil';

export { startEditingBase, startEditingCurrentHistory };

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
        validDateFrom: targetDate || DateUtil.getToday(),
      })
    );
  };

export const startEditingNewRecord =
  (
    sfObjFieldValues: {
      [key: string]: any;
    },
    targetDate: string,
    companyId: string
  ) =>
  (dispatch: AppDispatch) => {
    dispatch(BaseRecordActions.initialize());
    dispatch(HistoryRecordListActions.initialize());
    dispatch(DetailActions.initialize());
    dispatch(setNewRecord(sfObjFieldValues, targetDate));
    dispatch(showDetailPane(true));
    dispatch(setModeBase(DETAIL_PANEL_MODE.NEW));
    dispatch(setModeHistory(DETAIL_PANEL_MODE.NEW));
    dispatch(
      DetailActions.setHistoryRecordByKeyValue(
        'primary' as keyof MasterEmployeeHistory,
        true
      )
    );
    dispatch(
      DetailActions.setHistoryRecordByKeyValue(
        'revisionType' as keyof MasterEmployeeHistory,
        REVISION_TYPE_V2.NewlyCreated
      )
    );
    dispatch(
      DetailActions.setHistoryRecordByKeyValue(
        'companyId' as keyof MasterEmployeeHistory,
        companyId
      )
    );
  };

export const startEditingHistory =
  ({ targetDate, comment }: { targetDate: string; comment: string }) =>
  (dispatch: AppDispatch) => {
    dispatch(
      DetailActions.setHistoryRecordByKeyValue('validDateFrom', targetDate)
    );
    dispatch(DetailActions.setHistoryRecordByKeyValue('validDateTo', ''));
    dispatch(DetailActions.setHistoryRecordByKeyValue('comment', comment));
    dispatch(
      DetailActions.setHistoryRecordByKeyValue(
        'revisionType',
        REVISION_TYPE_V2.Revision
      )
    );

    dispatch(setRevisionDialog(false));
    dispatch(setModeBase(DETAIL_PANEL_MODE.VIEW));
    dispatch(setModeHistory(DETAIL_PANEL_MODE.REVISION));
  };

export const startAddNewSubRole =
  (prevHistory, sfObjFieldValues, targetDate) => (dispatch: AppDispatch) => {
    dispatch(setModeBase(DETAIL_PANEL_MODE.VIEW));
    dispatch(setModeHistory(DETAIL_PANEL_MODE.ADD_SUB_ROLE));
    const historyRecord = RecordUtil.make(
      configList.history || [],
      sfObjFieldValues
    );
    dispatch(
      DetailActions.setHistoryRecord({
        ...historyRecord,
        validDateFrom: targetDate || DateUtil.getToday(),
        primary: false,
        revisionType: REVISION_TYPE_V2.Revision,
        companyId: prevHistory.companyId,
        baseId: prevHistory.baseId,
      })
    );
  };

const fetchDetail =
  (
    baseId: string,
    targetDate: string,
    historyId?: string,
    fetchLatestPrimary?: boolean
  ) =>
  async (dispatch: Dispatch<any>): Promise<void> => {
    const [baseRecord, historyList] = await Promise.all([
      Repository.fetchBase(baseId),
      Repository.fetchHistoriesV2(baseId, true),
    ]);
    const primaryHistories = historyList.filter(({ primary }) => primary);
    let historyRecord;
    if (fetchLatestPrimary) {
      // auto select latest primary (handle case when revise primary, id returned can belong to other roles)
      historyRecord = primaryHistories[0];
    } else {
      historyRecord = historyId
        ? historyList.find(({ id }) => id === historyId)
        : getClosestHistoryRecord(targetDate, primaryHistories);
    }

    if (!historyRecord) {
      throw new Error();
    }

    dispatch(HistoryRecordListActions.fetch(historyList));
    dispatch(BaseRecordActions.fetch(baseRecord));
    dispatch(DetailActions.setBaseRecord(baseRecord));
    dispatch(DetailActions.setHistoryRecord(historyRecord));

    dispatch(DetailActions.setSelectedHistoryId(historyRecord.id || ''));
    dispatch(
      DetailActions.setSelectedSubRoleKey(historyRecord.subRoleKey || 'primary')
    );
  };

export const showDetail =
  (baseId: string, targetDate: string) =>
  async (dispatch: Dispatch<any>): Promise<void> => {
    const app = App(dispatch);
    try {
      app.loadingStart();

      await dispatch(fetchDetail(baseId, targetDate));

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
  (value: string, historyRecordList: MasterEmployeeHistory[]) =>
  (dispatch: AppDispatch) => {
    const historyRecord =
      historyRecordList.find(({ id }) => id === value) || defaultHistoryRecord;
    dispatch(DetailActions.setHistoryRecord(historyRecord));
    dispatch(DetailActions.setSelectedHistoryId(value));
  };

export const changeRole =
  (value: string, historyRecordList: MasterEmployeeHistory[]) =>
  (dispatch: AppDispatch) => {
    const latestHistoryUnderRole = historyRecordList.find(
      ({ subRoleKey }) => subRoleKey === value
    );
    const historyId = latestHistoryUnderRole.id;
    dispatch(DetailActions.setSelectedSubRoleKey(value));
    dispatch(DetailActions.setHistoryRecord(latestHistoryUnderRole));
    dispatch(DetailActions.setSelectedHistoryId(historyId));
  };

export const createRecord =
  (
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

      const configListAll = [...configList.base, ...(configList.history || [])];
      const hasUninputRequiredValue = !dispatch(
        checkIsRequiredFieldFilled(
          configListAll,
          editingRecord,
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
        editingRecord,
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

      const hasUninputRequiredValue = !dispatch(
        checkIsRequiredFieldFilled(
          configList.base,
          editingBaseRecord,
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
        editingBaseRecord,
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
    modeHistory: string
  ) =>
  async (dispatch: Dispatch<any>): Promise<boolean> => {
    const app = App(dispatch);
    try {
      app.loadingStart();

      const isResign =
        editingHistoryRecord.revisionType === REVISION_TYPE_V2.Resignation;
      let validationConfig = configList;
      if (isResign) {
        editingHistoryRecord.validDateTo = null;
        editingHistoryRecord.validDateFrom = null;
        const { companyId, departmentId, department, positionId, position } =
          originalHistoryRecord;
        editingHistoryRecord.companyId = companyId;
        editingHistoryRecord.departmentId = departmentId;
        editingHistoryRecord.department = department;
        editingHistoryRecord.positionId = positionId;
        editingHistoryRecord.position = position;

        validationConfig = configListResign;
      }

      const hasUninputRequiredValue = !dispatch(
        checkIsRequiredFieldFilled(
          validationConfig.history || [],
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
        validationConfig.history || [],
        originalHistoryRecord,
        editingHistoryRecord,
        functionTypeList,
        baseValueGetter,
        historyValueGetter
      );

      const isPrimary = record.primary;
      let employeeAction = createHistoryEmployee;
      const isEditHistory = modeHistory === DETAIL_PANEL_MODE.EDIT;
      if (isEditHistory) {
        employeeAction = updateHistoryEmployee;
      } else if (
        modeHistory === DETAIL_PANEL_MODE.ADD_SUB_ROLE ||
        (!isPrimary && modeHistory === DETAIL_PANEL_MODE.REVISION)
      ) {
        // add subrole & revise subrole
        employeeAction = addSubRoleEmployee;
      }

      const result = await dispatch(employeeAction(record));

      /*
       * Auto select history logic:
       *
       * Subrole: add    - use id from res
       *          revise - use id from res
       *          edit   - use record id
       *
       * Primary: revise - select latest primary
       *          edit   - use record id
       *          (because for primary, the id from res may not belong to this history)
       */
      const historyId = isEditHistory ? record.id : get(result, 'id');
      const fetchLatestPrimary = isPrimary && !isEditHistory;

      dispatch(setModeBase(DETAIL_PANEL_MODE.VIEW));
      dispatch(setModeHistory(DETAIL_PANEL_MODE.VIEW));

      await dispatch(
        fetchDetail(
          editingHistoryRecord.baseId || '',
          editingHistoryRecord.validDateFrom || '',
          historyId,
          fetchLatestPrimary
        )
      );

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
  (
    historyId: string,
    baseId: string,
    targetDate: string,
    currentRoleId: string
  ) =>
  async (dispatch: Dispatch<any>): Promise<boolean> => {
    const answer = await dispatch(confirm(msg().Admin_Msg_ConfirmDelete));
    if (!answer) {
      return false;
    }

    const app = App(dispatch);
    try {
      app.loadingStart();
      await dispatch(deleteHistoryEmployee({ id: historyId }));

      const [baseRecord, historyList] = await Promise.all([
        Repository.fetchBase(baseId),
        Repository.fetchHistoriesV2(baseId, true),
      ]);

      const primaryHistories = historyList.filter(({ primary }) => primary);
      const prevHistories = historyList.filter(
        ({ subRoleKey }) => subRoleKey === currentRoleId
      );
      const selectedHistories = isEmpty(prevHistories)
        ? primaryHistories
        : prevHistories;
      const historyRecord =
        getClosestHistoryRecord(targetDate, selectedHistories) ||
        defaultHistoryRecord;

      dispatch(HistoryRecordListActions.fetch(historyList));
      dispatch(BaseRecordActions.fetch(baseRecord));
      dispatch(DetailActions.setBaseRecord(baseRecord));
      dispatch(DetailActions.setHistoryRecord(historyRecord));
      dispatch(DetailActions.setSelectedHistoryId(historyRecord.id || ''));
      dispatch(
        DetailActions.setSelectedSubRoleKey(
          historyRecord.subRoleKey || 'primary'
        )
      );
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
    dispatch(setModeBase(DETAIL_PANEL_MODE.VIEW));
    dispatch(setModeHistory(DETAIL_PANEL_MODE.VIEW));
    dispatch(DetailActions.setBaseRecord(baseRecord));
    dispatch(DetailActions.setHistoryRecord(historyRecord));
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

export const setHistoryRecord =
  (historyRecord: MasterEmployeeHistory) => (dispatch: Dispatch<any>) => {
    dispatch(DetailActions.setHistoryRecord(historyRecord));
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

export const searchDepartmentByQuery =
  (query: {
    code: DeptSearchQuery['code'];
    name: DeptSearchQuery['name'];
    targetDate: DeptSearchQuery['targetDate'];
    companyId: DeptSearchQuery['companyId'];
    sortCondition: DeptSearchQuery['sortCondition'];
  }) =>
  async (dispatch: AppDispatch) => {
    const app = App(dispatch);
    try {
      app.loadingStart();
      const targetDate = query.targetDate || DateUtil.getToday();
      const { ids, isOverLimit } = await DeptRepository.searchIds(query);
      let records = [];
      if (ids && ids.length > 0) {
        records = await DeptRepository.getRecords(ids, targetDate);
      }
      return { records, isOverLimit };
    } catch (err) {
      app.catchApiError(err);
    } finally {
      app.loadingEnd();
    }
  };
