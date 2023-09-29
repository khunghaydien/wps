import { Dispatch } from 'redux';

import isEmpty from 'lodash/isEmpty';
import moment from 'moment';

import { FunctionTypeList } from '../constants/functionType';

import {
  catchApiError,
  catchBusinessError,
  confirm,
} from '../../commons/actions/app';
import msg from '../../commons/languages';

import {
  MODE,
  setModeBase,
  setModeHistory,
  showDetailPane,
  showRevisionDialog as setRevisionDialog,
} from '../modules/base/detail-pane/ui';

// NOTE: setEditRecord() call  internally setTmpEditRecord().
// setEditRecordHistory() call internally setTempEditRecordHistory().
import {
  setEditRecord,
  setEditRecordHistory,
  setTmpEditRecord,
  setTmpEditRecordByKeyValue,
  setTmpEditRecordHistory,
  setTmpEditRecordHistoryByKeyValue,
} from '../actions/editRecord';
import { initializeHistory } from '../actions/history';

import * as ConfigUtil from '../utils/ConfigUtil';
import * as RecordUtil from '../utils/RecordUtil';

import { AppDispatch } from './AppThunk';

export const checkIsRequiredFieldFilled =
  (
    configList: ConfigUtil.ConfigList,
    record: RecordUtil.Record,
    functionTypeList: FunctionTypeList,
    baseValueGetter: (arg0: string) => any,
    historyValueGetter: (arg0: string) => any
  ) =>
  (dispatch: Dispatch<any>): boolean => {
    const invalid = RecordUtil.getFirstInvalidConfig(
      configList,
      record,
      functionTypeList,
      baseValueGetter,
      historyValueGetter
    );
    if (invalid) {
      dispatch(
        catchBusinessError(
          msg().Admin_Lbl_ValidationCheck,
          msg()[invalid.msgkey || ''],
          msg().Admin_Msg_EmptyItem
        )
      );
    }
    return !invalid;
  };

const invokeConfigAction = (
  configList: ConfigUtil.ConfigList,
  actions: {
    [key: string]: (...args0: any) => any;
  },
  params: {
    companyId: string;
    targetDate?: string;
  }
) => {
  configList.forEach((config) => {
    if (config.section) {
      invokeConfigAction(config.configList || [], actions, params);
    } else if (config.key) {
      const key = config.action;
      if (key && actions[key]) {
        actions[key](params);
      }
    }
  });
};

const invokeService = async (
  configList: ConfigUtil.ConfigList,
  orgRecord: RecordUtil.Record,
  edtRecord: RecordUtil.Record,
  functionTypeList: FunctionTypeList,
  baseValueGetter: (arg0: string) => any,
  historyValueGetter: (arg0: string) => any,
  actionMethod: (arg0: RecordUtil.Record, arg1: string) => Promise<any>,
  companyId: string,
  insteadMethod?: () => void
): Promise<void> => {
  if (insteadMethod) {
    await insteadMethod();
  } else {
    const record = RecordUtil.makeForRemote(
      configList,
      orgRecord,
      edtRecord,
      functionTypeList,
      baseValueGetter,
      historyValueGetter
    );
    await actionMethod(record, companyId);
  }
};

export const showDetail =
  (
    configList: ConfigUtil.ConfigListMap,
    baseRecord: RecordUtil.Record,
    actions: {
      searchHistory: (arg0: { baseId: string }) => Promise<
        {
          [key: string]: any;
        }[]
      >;
    },
    companyId: string,
    insteadMethod?: (arg0: RecordUtil.Record) => Promise<void>,
    curMode?: string
  ) =>
  async (dispatch: Dispatch<any>): Promise<void> => {
    dispatch(setEditRecord(baseRecord));

    if (configList.history && configList.history.length !== 0) {
      const historyList = await actions.searchHistory({
        baseId: baseRecord.id,
      });
      const history = historyList.find(
        (item) => item.id === baseRecord.historyId
      );
      if (!history) {
        dispatch(
          catchApiError(new Error("Can't find a record."), {
            isContinuable: false,
          })
        );
        return;
      }

      dispatch(setEditRecordHistory(history));

      invokeConfigAction(configList.history || [], actions, {
        companyId,
        targetDate: history.validDateFrom,
      });
    }

    if (insteadMethod) {
      await insteadMethod(baseRecord);
    }

    dispatch(showDetailPane(true));
    if (curMode !== MODE.CUSTOM) {
      dispatch(setModeBase(MODE.VIEW));
      dispatch(setModeHistory(MODE.VIEW));
    }
  };

export const hideDetail = () => (dispatch: Dispatch<any>) => {
  dispatch(showDetailPane(false));
  dispatch(setEditRecord({}));
  dispatch(setEditRecordHistory({}));
  dispatch(setModeBase(MODE.VIEW));
  dispatch(setModeHistory(MODE.VIEW));
};

export const showRevisionDialog = () => (dispatch: Dispatch<any>) => {
  dispatch(setRevisionDialog(true));
  dispatch(setModeBase(MODE.VIEW));
  dispatch(setModeHistory(MODE.VIEW));
};

export const setClonedRecord =
  (
    configList: ConfigUtil.ConfigListMap,
    sourceValues: RecordUtil.Record,
    sourceHistoryValues: RecordUtil.Record
  ) =>
  (dispatch: Dispatch<any>) => {
    const clonedRecord = RecordUtil.clone(configList.base, sourceValues);
    dispatch(setEditRecord(clonedRecord));
    if (!isEmpty(configList.history)) {
      const clonedRecordHistory = RecordUtil.clone(
        configList.history,
        sourceHistoryValues
      );
      dispatch(setEditRecordHistory(clonedRecordHistory));
    }
  };

export const setNewRecord =
  (
    configList: ConfigUtil.ConfigListMap,
    sfObjFieldValues: {
      [key: string]: any;
    },
    historyTargetDate?: string
  ) =>
  (dispatch: Dispatch<any>) => {
    // FIXME: condition を持っていても、後勝で値を初期化してしまっているので
    // condition も見ながら初期化するように修正したい。
    const baseRecord = RecordUtil.make(configList.base, sfObjFieldValues);
    dispatch(setEditRecord(baseRecord));

    if (configList.history && configList.history.length !== 0) {
      const historyRecord = RecordUtil.make(
        configList.history,
        sfObjFieldValues
      );
      dispatch(
        setEditRecordHistory({
          ...historyRecord,
          validDateFrom: historyTargetDate || moment().format('YYYY-MM-DD'),
        })
      );
    } else {
      dispatch(setEditRecordHistory({}));
    }
  };

export const changeHistory =
  (
    id: string,
    historyList: RecordUtil.Record[],
    configList: ConfigUtil.ConfigListMap,
    actions: {
      [key: string]: () => any;
    },
    companyId: string
  ) =>
  (dispatch: Dispatch<any>) => {
    const history = historyList.find((item) => item.id === id);
    if (history) {
      dispatch(setEditRecordHistory(history));
      invokeConfigAction(configList.history || [], actions, {
        companyId,
        targetDate: history.validDateFrom,
      });
    }
  };

export const initialize =
  (
    configList: ConfigUtil.ConfigListMap,
    sfObjFieldValues: {
      [key: string]: any;
    },
    actions: {
      search: (arg0: { companyId: string; targetDate?: string }) => void;
    },
    companyId: string,
    targetDate?: string,
    hasList?: boolean,
    moduleType?: string,
    objectType?: string,
    isOpenDetail?: boolean
  ) =>
  (dispatch: AppDispatch) => {
    if (!isOpenDetail) {
      dispatch(showDetailPane(false));
    }
    if (hasList && !isOpenDetail) {
      dispatch(setNewRecord(configList, sfObjFieldValues, targetDate));
    }
    let param: {
      companyId: string;
      targetDate?: string;
      moduleType?: string;
      objectType?: string;
    } = {
      companyId,
    };
    if (hasList && targetDate) {
      param = { ...param, targetDate };
    }
    if (moduleType) {
      param = { ...param, moduleType };
    }
    if (objectType) {
      param = { ...param, objectType };
    }
    actions.search(param);
  };

export const create =
  (
    configList: ConfigUtil.ConfigListMap,
    orgRecord: RecordUtil.Record,
    edtRecord: RecordUtil.Record,
    functionTypeList: FunctionTypeList,
    baseValueGetter: (arg0: string) => any,
    historyValueGetter: (arg0: string) => any,
    actions: {
      create: (arg0: RecordUtil.Record, arg1: string) => Promise<any>;
    },
    companyId: string,
    insteadMethod?: () => void,
    isShowDetailAfterCreate?: boolean
  ) =>
  async (dispatch: Dispatch<any>): Promise<boolean> => {
    const configListAll = [...configList.base, ...(configList.history || [])];
    const hasUninputRequiredValue = !dispatch(
      checkIsRequiredFieldFilled(
        configListAll,
        edtRecord,
        functionTypeList,
        baseValueGetter,
        historyValueGetter
      )
    );

    if (hasUninputRequiredValue) {
      return false;
    }

    await invokeService(
      configListAll,
      orgRecord,
      edtRecord,
      functionTypeList,
      baseValueGetter,
      historyValueGetter,
      actions.create,
      companyId,
      insteadMethod
    );

    if (!isShowDetailAfterCreate) {
      dispatch(hideDetail());
    }

    return true;
  };

export const appendHistory =
  (
    configList: ConfigUtil.ConfigListMap,
    orgHistoryRecord: RecordUtil.Record,
    edtHistoryRecord: RecordUtil.Record,
    functionTypeList: FunctionTypeList,
    baseValueGetter: (arg0: string) => any,
    historyValueGetter: (arg0: string) => any,
    actions: {
      createHistory: (arg0: RecordUtil.Record, arg1: string) => Promise<any>;
      searchHistory: (arg0: { baseId: string }) => Promise<{
        [key: string]: any;
      }>;
      search: (arg0: { companyId: string }) => Promise<{
        [key: string]: any;
      }>;
    },
    companyId: string,
    insteadMethod?: () => void
  ) =>
  async (
    dispatch: Dispatch<any>
  ): Promise<null | {
    [key: string]: any;
  }> => {
    const hasUninputRequiredValue = !dispatch(
      checkIsRequiredFieldFilled(
        configList.history || [],
        edtHistoryRecord,
        functionTypeList,
        baseValueGetter,
        historyValueGetter
      )
    );

    if (hasUninputRequiredValue) {
      return null;
    }

    await invokeService(
      configList.history || [],
      orgHistoryRecord,
      edtHistoryRecord,
      functionTypeList,
      baseValueGetter,
      historyValueGetter,
      actions.createHistory,
      companyId,
      insteadMethod
    );

    const historyList = await actions.searchHistory({
      baseId: edtHistoryRecord.baseId,
    });

    const history =
      historyList.find(
        (item) => item.validDateFrom === edtHistoryRecord.validDateFrom
      ) || {};

    dispatch(setEditRecordHistory(history));
    dispatch(setModeBase(MODE.VIEW));
    dispatch(setModeHistory(MODE.VIEW));

    await actions.search({ companyId });

    return history;
  };

export const updateBase =
  (
    configList: ConfigUtil.ConfigListMap,
    orgbaseRecord: RecordUtil.Record,
    edtbaseRecord: RecordUtil.Record,
    functionTypeList: FunctionTypeList,
    baseValueGetter: (arg0: string) => any,
    historyValueGetter: (arg0: string) => any,
    actions: {
      update: (arg0: RecordUtil.Record, arg1: string) => Promise<any>;
    },
    companyId: string,
    insteadMethod?: () => void,
    isResetTmpRecord = true
  ) =>
  async (dispatch: Dispatch<any>): Promise<boolean> => {
    const hasUninputRequiredValue = !dispatch(
      checkIsRequiredFieldFilled(
        configList.base,
        edtbaseRecord,
        functionTypeList,
        baseValueGetter,
        historyValueGetter
      )
    );

    if (hasUninputRequiredValue) {
      return false;
    }

    await invokeService(
      configList.base,
      orgbaseRecord,
      edtbaseRecord,
      functionTypeList,
      baseValueGetter,
      historyValueGetter,
      actions.update,
      companyId,
      insteadMethod
    );
    if (isResetTmpRecord) {
      dispatch(setTmpEditRecord({}));
    }
    dispatch(showDetailPane(false));
    dispatch(setModeBase(MODE.VIEW));
    dispatch(setModeHistory(MODE.VIEW));

    return true;
  };

export const updateHistory =
  (
    configList: ConfigUtil.ConfigListMap,
    orgHistoryRecord: RecordUtil.Record,
    edtHistoryRecord: RecordUtil.Record,
    functionTypeList: FunctionTypeList,
    baseValueGetter: (arg0: string) => any,
    historyValueGetter: (arg0: string) => any,
    actions: {
      updateHistory: (arg0: RecordUtil.Record, arg1: string) => Promise<any>;
    },
    companyId: string,
    insteadMethod?: () => void
  ) =>
  async (dispatch: Dispatch<any>): Promise<boolean> => {
    const hasUninputRequiredValue = !dispatch(
      checkIsRequiredFieldFilled(
        configList.history || [],
        edtHistoryRecord,
        functionTypeList,
        baseValueGetter,
        historyValueGetter
      )
    );

    if (hasUninputRequiredValue) {
      return false;
    }

    await invokeService(
      configList.history || [],
      orgHistoryRecord,
      edtHistoryRecord,
      functionTypeList,
      baseValueGetter,
      historyValueGetter,
      actions.updateHistory,
      companyId,
      insteadMethod
    );

    dispatch(setEditRecordHistory(edtHistoryRecord));
    dispatch(setModeBase(MODE.VIEW));
    dispatch(setModeHistory(MODE.VIEW));

    return true;
  };

export const removeBase =
  (
    actions: {
      delete: (
        arg0: {
          id: string;
        },
        arg1: string
      ) => Promise<void>;
    },
    baseId: string,
    companyId: string
  ) =>
  async (dispatch: Dispatch<any>): Promise<boolean> => {
    const result = await dispatch(confirm(msg().Admin_Msg_ConfirmDelete));
    if (!result) {
      return false;
    }
    await actions.delete({ id: baseId }, companyId);
    return true;
  };

export const removeHistory =
  (
    actions: {
      deleteHistory: (arg0: { id: string }) => Promise<void>;
    },
    historyId: string
  ) =>
  async (dispatch: Dispatch<any>): Promise<boolean> => {
    const answer = await dispatch(confirm(msg().Admin_Msg_ConfirmDelete));
    if (!answer) {
      return false;
    }

    await actions.deleteHistory({ id: historyId });

    return true;
  };

export const startEditingClonedRecord =
  (
    configList: ConfigUtil.ConfigListMap,
    sourceValues: RecordUtil.Record,
    sourceHistoryValues: RecordUtil.Record
  ) =>
  (dispatch: Dispatch<any>) => {
    dispatch(setClonedRecord(configList, sourceValues, sourceHistoryValues));
    dispatch(showDetailPane(true));
    dispatch(setModeBase(MODE.CLONE));
    dispatch(setModeHistory(MODE.CLONE));
  };

export const startEditingNewRecord =
  (
    configList: ConfigUtil.ConfigListMap,
    sfObjFieldValues: {
      [key: string]: any;
    },
    actions: {
      [key: string]: (...args: any) => any;
    },
    companyId: string
  ) =>
  (dispatch: Dispatch<any>) => {
    dispatch(setNewRecord(configList, sfObjFieldValues));
    if (configList.history) {
      dispatch(initializeHistory());
      invokeConfigAction(configList.history || [], actions, {
        companyId,
        targetDate: moment().format('YYYY-MM-DD'),
      });
    }
    dispatch(showDetailPane(true));
    dispatch(setModeBase(MODE.NEW));
    dispatch(setModeHistory(MODE.NEW));
  };

export const startEditingBase = () => (dispatch: Dispatch<any>) => {
  dispatch(setModeBase(MODE.EDIT));
  dispatch(setModeHistory(MODE.VIEW));
};

export const startEditingHistory =
  (
    param: RecordUtil.Record,
    oldHistoryRecord: RecordUtil.Record = {},
    configList: ConfigUtil.ConfigList = [],
    actions: {
      [key: string]: () => any;
    } = {},
    companyId = ''
  ) =>
  (dispatch: Dispatch<any>) => {
    dispatch(
      setTmpEditRecordHistory({
        ...oldHistoryRecord,
        ...param,
      })
    );
    if (oldHistoryRecord.validDateFrom !== param.validDateFrom) {
      invokeConfigAction(configList, actions, {
        companyId,
        targetDate: param.validDateFrom,
      });
    }
    dispatch(setRevisionDialog(false));
    dispatch(setModeBase(MODE.VIEW));
    dispatch(setModeHistory(MODE.REVISION));
  };

export const startEditingCurrentHistory = () => (dispatch: Dispatch<any>) => {
  dispatch(setModeBase(MODE.VIEW));
  dispatch(setModeHistory(MODE.EDIT));
};

export const cancelEditing =
  (
    baseRecord: RecordUtil.Record,
    historyRecord: RecordUtil.Record,
    configList: ConfigUtil.ConfigListMap,
    actions: {
      [key: string]: () => any;
    } = {},
    companyId: string
  ) =>
  (dispatch: Dispatch<any>) => {
    if (configList.history) {
      invokeConfigAction(configList.history || [], actions, {
        companyId,
        targetDate: historyRecord.validDateFrom,
      });
    }
    dispatch(setRevisionDialog(false));
    dispatch(setTmpEditRecord(baseRecord));
    dispatch(setTmpEditRecordHistory(historyRecord));
    dispatch(setModeBase(MODE.VIEW));
    dispatch(setModeHistory(MODE.VIEW));
  };

export const checkCharType = (charType: string, value: any): boolean => {
  switch (charType) {
    case 'numeric':
      return isFinite(value);
    case 'numeric_0-99':
      /**
       * This will only allow the input from 0 to 99
       * ^([0-9]|[1-9][0-9])$|^$     - Regex expression test
       * ^([0-9]                     - Allow 1 character in the range from 0 to 9
       *        |[1-9][0-9])$|       - OR Allow 2 characters in the range from 10 to 99
       *                     |^$     - OR Allow empty
       */
      return /^([0-9]|[1-9][0-9])$|^$/.test(value);
    default:
      return true;
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
  (
    key: string,
    value: any,
    charType?: string,
    oldHistoryRecord: RecordUtil.Record = {},
    configList: ConfigUtil.ConfigList = [],
    actions: {
      [key: string]: () => any;
    } = {},
    companyId = ''
  ) =>
  (dispatch: Dispatch<any>) => {
    if (!checkCharType(charType, value)) {
      return;
    }
    if (key === 'validDateFrom') {
      // 子データの validDateForm を更新した場合、
      // 関連するリストを更新する必要があります。
      // (部署・社員のマスターで使われています。)
      // しかし、常に関連するリストを更新を処理を行うと
      // 改定ダイアログの [保存] ボタンの１回目が効かなってしまう不具合（下記 URL）があったため
      // コチラの if 文を追加しました。
      // https://teamspiritdev.atlassian.net/browse/GENIE-9231
      if (oldHistoryRecord.validDateFrom !== value) {
        invokeConfigAction(configList, actions, {
          companyId,
          targetDate: value,
        });
      }
    }
    dispatch(setTmpEditRecordHistoryByKeyValue(key, value));
  };
