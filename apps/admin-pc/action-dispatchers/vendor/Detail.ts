import { bindActionCreators, Dispatch } from 'redux';

import configList from '../../constants/configList/vendor';
import { FunctionTypeList } from '../../constants/functionType';

import {
  catchApiError,
  confirm,
  loadingEnd,
  loadingStart,
} from '../../../commons/actions/app';
import msg from '../../../commons/languages';

import { Repository, Vendor } from '../../../domain/models/exp/Vendor';

import {
  MODE as DETAIL_PANEL_MODE,
  setModeBase,
  showDetailPane,
} from '../../modules/base/detail-pane/ui';
import { actions as BaseRecordActions } from '../../modules/vendor/entities/baseRecord';
import { actions as DetailActions } from '../../modules/vendor/ui/detail';

import { createVendor, deleteVendor, updateVendor } from '../../actions/vendor';

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

export const setClonedRecord =
  (baseRecord: RecordUtil.Record) => (dispatch: Dispatch<any>) => {
    // @ts-ignore
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

export const startEditingClonedRecord =
  (baseRecord: RecordUtil.Record) => (dispatch: Dispatch<any>) => {
    dispatch(setClonedRecord(baseRecord));
    dispatch(showDetailPane(true));
    dispatch(setModeBase(DETAIL_PANEL_MODE.CLONE));
  };

export const showDetail =
  (companyId: string, baseId: string) =>
  async (dispatch: Dispatch<any>): Promise<void> => {
    const app = App(dispatch);
    try {
      app.loadingStart();
      const baseRecord = await Repository.get(baseId);
      dispatch(BaseRecordActions.fetch(baseRecord));
      dispatch(DetailActions.setBaseRecord(baseRecord));
      dispatch(showDetailPane(true));
      dispatch(setModeBase(DETAIL_PANEL_MODE.VIEW));
    } catch (err) {
      app.catchApiError(new Error(err), {
        isContinuable: false,
      });
    } finally {
      app.loadingEnd();
    }
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

      await dispatch(createVendor(record));

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
    originalBaseRecord: Vendor,
    editingBaseRecord: Vendor,
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

      await dispatch(updateVendor(record));

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
      await dispatch(deleteVendor({ id: baseId }));
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
  (baseRecord: Vendor) => (dispatch: Dispatch<any>) => {
    dispatch(DetailActions.setBaseRecord(baseRecord));
    dispatch(setModeBase(DETAIL_PANEL_MODE.VIEW));
  };

export const changeBaseRecordValue =
  (key: keyof Vendor, value: Vendor[keyof Vendor]) =>
  (dispatch: Dispatch<any>) => {
    dispatch(DetailActions.setBaseRecordByKeyValue(key, value));
  };
