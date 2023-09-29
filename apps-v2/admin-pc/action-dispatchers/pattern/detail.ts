import { bindActionCreators } from 'redux';

import configList from '../../constants/configList/attPattern';
import { FunctionTypeList } from '../../constants/functionType';

import { confirm } from '@apps/commons/actions/app';
import msg from '@apps/commons/languages';

import { SortOrder } from '@apps/repositories/organization/attPattern/AttPatternListRepository';

import {
  MODE,
  setModeBase,
  showDetailPane,
} from '../../modules/base/detail-pane/ui';
import { actions as UIListActions } from '../../modules/base/list-pane/ui/list';
import { actions as listActions } from '../../modules/pattern/ui/list';

import {
  createAttPattern,
  deleteAttPattern,
  updateAttPattern,
} from '../../actions/attPattern';
import {
  setEditRecord,
  setTmpEditRecord,
  setTmpEditRecordByKeyValue,
} from '../../actions/editRecord';

import * as RecordUtil from '../../utils/RecordUtil';

import { AppDispatch } from '../AppThunk';
import { checkCharType, checkIsRequiredFieldFilled } from '../Edit';
import ListActions, { SearchCondition } from './list';

interface PatternDetailService {
  startEditingNewRecord: (
    companyId: string,
    sfObjFieldValues: {
      [key: string]: any;
    }
  ) => void;
  create: (
    editRecord: RecordUtil.Record,
    tmpEditRecord: RecordUtil.Record,
    functionTypeList: FunctionTypeList,
    companyId: string,
    searchCondition: SearchCondition,
    sortOrder: SortOrder,
    chunkSize: number,
    isOverLimit: boolean
  ) => Promise<void>;
  changeRecordValue: (key: string, value: any, charType?: string) => void;
  updateBase: (
    editRecord: RecordUtil.Record,
    tmpEditRecord: RecordUtil.Record,
    functionTypeList: FunctionTypeList,
    companyId: string,
    searchCondition: SearchCondition,
    sortOrder: SortOrder,
    chunkSize: number,
    isOverLimit: boolean,
    pagingConditon: {
      offsetCode: string;
      currentPage: number;
    }
  ) => void;
  remove: (
    baseId: string,
    companyId: string,
    searchCondition: SearchCondition,
    sortOrder: SortOrder,
    chunkSize: number,
    isOverLimit: boolean
  ) => Promise<void>;
  startEditingBase: (editRecord: RecordUtil.Record) => void;
  cancelEditing: (editRecord: RecordUtil.Record) => void;
}

export default (dispatch: AppDispatch): PatternDetailService => {
  const list = bindActionCreators(listActions, dispatch);
  const listDispatch = ListActions(dispatch);
  const uiList = bindActionCreators(UIListActions, dispatch);
  return {
    startEditingNewRecord: (
      companyId: string,
      sfObjFieldValues: {
        [key: string]: any;
      }
    ) => {
      const baseRecord = RecordUtil.make(configList.base, sfObjFieldValues);
      dispatch(setEditRecord({ ...baseRecord, companyId }));
      dispatch(showDetailPane(true));
      dispatch(setModeBase(MODE.NEW));
      list.resetSelectedCode();
    },
    create: async (
      editRecord: RecordUtil.Record,
      tmpEditRecord: RecordUtil.Record,
      functionTypeList: FunctionTypeList,
      companyId: string,
      searchCondition: SearchCondition,
      sortOrder: SortOrder,
      chunkSize: number,
      isOverLimit: boolean
    ) => {
      const orgRecord = {
        ...editRecord,
      };
      const newRecord = {
        ...tmpEditRecord,
        companyId,
      };
      const configListAll = [...configList.base];
      const baseValueGetter = RecordUtil.getter(tmpEditRecord);

      const hasUninputRequiredValue = !dispatch(
        checkIsRequiredFieldFilled(
          configListAll,
          newRecord,
          functionTypeList,
          baseValueGetter,
          () => {}
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
        () => {}
      );
      await dispatch(createAttPattern(record));

      listDispatch.search(
        { ...searchCondition, companyId },
        sortOrder,
        chunkSize,
        isOverLimit,
        false,
        true
      );
    },
    changeRecordValue: (key: string, value: any, charType?: string) => {
      if (!checkCharType(charType, value)) {
        return;
      }
      dispatch(setTmpEditRecordByKeyValue(key, value));
    },
    updateBase: async (
      editRecord: RecordUtil.Record,
      tmpEditRecord: RecordUtil.Record,
      functionTypeList: FunctionTypeList,
      companyId: string,
      searchCondition: SearchCondition,
      sortOrder: SortOrder,
      chunkSize: number,
      isOverLimit: boolean,
      pagingConditon: {
        offsetCode: string;
        currentPage: number;
      }
    ) => {
      const baseValueGetter = RecordUtil.getter(tmpEditRecord);

      const hasUninputRequiredValue = !dispatch(
        checkIsRequiredFieldFilled(
          configList.base,
          tmpEditRecord,
          functionTypeList,
          baseValueGetter,
          () => {}
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
        () => {}
      );
      await dispatch(updateAttPattern(record));

      dispatch(showDetailPane(false));
      dispatch(setModeBase(MODE.VIEW));

      uiList.setSelectedRowIndex(-1);

      listDispatch.search(
        { ...searchCondition, companyId },
        sortOrder,
        chunkSize,
        isOverLimit,
        false,
        true,
        pagingConditon
      );
    },
    remove: async (
      baseId: string,
      companyId: string,
      searchCondition: SearchCondition,
      sortOrder: SortOrder,
      chunkSize: number,
      isOverLimit: boolean
    ) => {
      const result = await dispatch(confirm(msg().Admin_Msg_ConfirmDelete));

      if (!result) {
        return;
      }

      dispatch(deleteAttPattern({ id: baseId })).then(() => {
        uiList.setSelectedRowIndex(-1);
        listDispatch.search(
          { ...searchCondition, companyId },
          sortOrder,
          chunkSize,
          isOverLimit,
          false,
          true
        );
      });
    },
    startEditingBase: (editRecord: RecordUtil.Record) => {
      dispatch(setTmpEditRecord(editRecord));
      dispatch(setModeBase(MODE.EDIT));
    },
    cancelEditing: (editRecord: RecordUtil.Record) => {
      dispatch(setTmpEditRecord(editRecord));
      dispatch(setModeBase(MODE.VIEW));
    },
  };
};
