import { bindActionCreators, Dispatch } from 'redux';

import configList from '../../constants/configList/workCategory';
import { FunctionTypeList } from '../../constants/functionType';

import {
  catchApiError,
  confirm,
  loadingEnd,
  loadingStart,
} from '../../../commons/actions/app';
import msg from '../../../commons/languages';

import { WorkCategory } from '../../../domain/models/time-tracking/WorkCategory';

import {
  MODE as DETAIL_PANEL_MODE,
  setModeBase,
  showDetailPane,
} from '../../modules/base/detail-pane/ui';
import { actions as BaseRecordActions } from '../../modules/work-category/entities/baseRecord';
import { actions as DetailActions } from '../../modules/work-category/ui/detail';

import {
  createWorkCategory,
  deleteWorkCategory,
  updateWorkCategory,
} from '../../actions/workCategory';

import * as RecordUtil from '../../utils/RecordUtil';

import { AppDispatch } from '../AppThunk';
import { checkIsRequiredFieldFilled, startEditingBase } from '../Edit';

export { startEditingBase };

const App = (dispatch: AppDispatch) =>
  bindActionCreators({ loadingStart, loadingEnd, catchApiError }, dispatch);

export const setNewRecord =
  (sfObjFieldValues: { [key: string]: any }) => (dispatch: Dispatch<any>) => {
    const baseRecord = RecordUtil.make(configList.base, sfObjFieldValues);

    dispatch(DetailActions.setBaseRecord(baseRecord));
  };

export const startEditingNewRecord =
  (sfObjFieldValues: { [key: string]: any }) => (dispatch: AppDispatch) => {
    dispatch(BaseRecordActions.initialize());
    dispatch(DetailActions.initialize());
    dispatch(setNewRecord(sfObjFieldValues));
    dispatch(showDetailPane(true));
    dispatch(setModeBase(DETAIL_PANEL_MODE.NEW));
  };

export const showDetail =
  (companyId: string, baseRecord: WorkCategory) =>
  (dispatch: Dispatch<any>): void => {
    dispatch(BaseRecordActions.fetch(baseRecord));
    dispatch(DetailActions.setBaseRecord(baseRecord));
    dispatch(showDetailPane(true));
    dispatch(setModeBase(DETAIL_PANEL_MODE.VIEW));
  };

export const createRecord =
  (
    companyId: string,
    originalRecord: RecordUtil.Record,
    editingRecord: RecordUtil.Record,
    baseValueGetter: (arg0: string) => any,
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

      const configListAll = configList.base;
      const hasUninputRequiredValue = !dispatch(
        checkIsRequiredFieldFilled(
          configListAll,
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
        configListAll,
        originalRecord,
        $editingRecord,
        functionTypeList,
        baseValueGetter,
        () => {}
      );

      await dispatch(createWorkCategory(record));

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
    originalBaseRecord: WorkCategory,
    editingBaseRecord: WorkCategory,
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

      await dispatch(updateWorkCategory(record));

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
      await dispatch(deleteWorkCategory({ id: baseId }));
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

export const hideDetail = () => (dispatch: Dispatch<any>) => {
  dispatch(BaseRecordActions.initialize());
  dispatch(DetailActions.initialize());
  dispatch(showDetailPane(false));
  dispatch(setModeBase(DETAIL_PANEL_MODE.VIEW));
};

export const cancelEditing =
  (baseRecord: WorkCategory) => (dispatch: Dispatch<any>) => {
    dispatch(DetailActions.setBaseRecord(baseRecord));
    dispatch(setModeBase(DETAIL_PANEL_MODE.VIEW));
  };

export const changeBaseRecordValue =
  (key: keyof WorkCategory, value: WorkCategory[keyof WorkCategory]) =>
  (dispatch: Dispatch<any>) => {
    dispatch(DetailActions.setBaseRecordByKeyValue(key, value));
  };
