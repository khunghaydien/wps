import React, { useCallback, useEffect, useMemo } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { bindActionCreators } from 'redux';

import configList from '../../constants/configList/workingType';
import { FunctionTypeList } from '../../constants/functionType';

import { ORDER_TYPE } from '@apps/repositories/organization/attPattern/AttPatternListRepository';

import { actions as $UIListActions } from '../../modules/base/list-pane/ui/list';

import * as DetailActions from '../../action-dispatchers/working-type/detail';
import * as $PanelActions from '../../action-dispatchers/working-type/panel';
import PatternActions from '../../action-dispatchers/working-type/pattern';
import * as $RevisionDialogActions from '../../action-dispatchers/working-type/revisionDialog';

import { State } from '../../reducers';

import Component from '../../presentational-components/WorkingType/MainContents/DetailPane';

import { RECORD_LIMIT_PER_PAGE } from './ListContainer';

const initCondition = {
  companyId: null,
  targetDate: null,
  codes: [],
  name: null,
  workSystem: null,
  withoutCore: null,
  isSearchCodeForPartialMatch: false,
};

const sortCondition = {
  field: 'code',
  order: ORDER_TYPE.ASC,
};

const DetailContainer = ({
  title,
  workSystem,
  useFunction,
}: {
  title: string;
  workSystem: string;
  useFunction: FunctionTypeList;
}) => {
  const {
    isShowRevisionDialog,
    modeBase,
    modeHistory,
    editRecord,
    editRecordHistory,
    tmpEditRecord,
    tmpEditRecordHistory,
    selectedHistoryId,
    recordHistoryList,
    companyId,
    sfObjFieldValues,
    getOrganizationSetting,
    searchCondition,
    limitPerPage,
    sortOrder,
    isOverLimit,
    selectedPattern,
    orginalSelectedPattern,
    currentPage,
    offsetCodes,
  } = useSelector(
    (state: State) => ({
      isShowRevisionDialog: state.detailPane.ui.isShowRevisionDialog,
      modeBase: state.detailPane.ui.modeBase,
      modeHistory: state.detailPane.ui.modeHistory,
      editRecord: state.editRecord,
      editRecordHistory: state.editRecordHistory,
      tmpEditRecord: state.tmpEditRecord,
      tmpEditRecordHistory: state.tmpEditRecordHistory,
      recordHistoryList: state.searchHistory,
      selectedHistoryId: state.workingType.ui.detail.selectedHistoryId,
      companyId: state.base.menuPane.ui.targetCompanyId,
      sfObjFieldValues: state.sfObjFieldValues,
      getOrganizationSetting: state.getOrganizationSetting,
      searchCondition: state.workingType.ui.searchCondition,
      limitPerPage: RECORD_LIMIT_PER_PAGE,
      sortOrder: state.workingType.ui.list.sortOrder,
      isOverLimit: state.workingType.ui.list.hasMoreRecords,
      selectedPattern:
        state.workingType.ui.pattern.selectedPattern.selectedPattern,
      orginalSelectedPattern:
        state.workingType.ui.pattern.selectedPattern.orginalSelectedPattern,
      currentPage: state.base.listPane.ui.paging.current,
      offsetCodes: state.workingType.ui.list.offsetCodes,
    }),
    shallowEqual
  );
  const dispatch = useDispatch();

  const originalCondition = useMemo(
    () => searchCondition.origin,
    [searchCondition]
  );

  const Actions = useMemo(
    () => bindActionCreators(DetailActions, dispatch),
    [dispatch]
  );
  const PanelActions = useMemo(
    () => bindActionCreators($PanelActions, dispatch),
    [dispatch]
  );

  const UIListActions = useMemo(
    () => bindActionCreators($UIListActions, dispatch),
    [dispatch]
  );

  const RevisionDialogActions = useMemo(
    () => bindActionCreators($RevisionDialogActions, dispatch),
    [dispatch]
  );

  const $init = useMemo(() => {
    return PatternActions(dispatch).initDetail;
  }, [dispatch]);

  const createHandler = useCallback(() => {
    Actions.create(
      editRecord,
      editRecordHistory,
      tmpEditRecord,
      {
        ...tmpEditRecordHistory,
        patternCodeList: selectedPattern.map((pattern) => pattern.code),
      },
      useFunction,
      { ...originalCondition, companyId },
      sortOrder,
      limitPerPage,
      isOverLimit,
      companyId
    );
  }, [
    Actions,
    editRecord,
    editRecordHistory,
    tmpEditRecord,
    tmpEditRecordHistory,
    useFunction,
    originalCondition,
    sortOrder,
    limitPerPage,
    isOverLimit,
    companyId,
    selectedPattern,
  ]);

  const changeRecordValueHandler = useCallback(
    (key: string, value: any, charType?: string) => {
      Actions.changeRecordValue(key, value, charType);
    },
    [Actions]
  );

  const changeRecordHistoryValueHandler = useCallback(
    (key: string, value: any, charType?: string) => {
      Actions.changeRecordHistoryValue(key, value, charType);
    },
    [Actions]
  );

  const updateBaseHandler = useCallback(() => {
    const offsetCode = offsetCodes[currentPage - 1];
    const pagingCondition = { offsetCode, currentPage };

    Actions.updateBase(
      editRecord,
      tmpEditRecord,
      {
        ...tmpEditRecordHistory,
        patternCodeList: selectedPattern.map((pattern) => pattern.code),
      },
      useFunction,
      { ...originalCondition, companyId },
      sortOrder,
      limitPerPage,
      isOverLimit,
      companyId,
      pagingCondition
    );
  }, [
    offsetCodes,
    currentPage,
    Actions,
    editRecord,
    tmpEditRecord,
    tmpEditRecordHistory,
    selectedPattern,
    useFunction,
    originalCondition,
    companyId,
    sortOrder,
    limitPerPage,
    isOverLimit,
  ]);

  const appendHistoryHandler = useCallback(() => {
    const offsetCode = offsetCodes[currentPage - 1];
    const pagingCondition = { offsetCode, currentPage };
    const condition = {
      searchCondition: { ...originalCondition, companyId },
      sortOrder,
      chunkSize: limitPerPage,
      isOverLimit,
      changeSort: false,
      pagingCondition,
    };
    Actions.appendHistory(
      editRecord,
      tmpEditRecord,
      {
        ...tmpEditRecordHistory,
        patternCodeList: selectedPattern.map((pattern) => pattern.code),
      },
      useFunction,
      condition
    );
  }, [
    offsetCodes,
    currentPage,
    originalCondition,
    companyId,
    sortOrder,
    limitPerPage,
    isOverLimit,
    Actions,
    editRecord,
    tmpEditRecord,
    tmpEditRecordHistory,
    selectedPattern,
    useFunction,
  ]);

  const updateHistoryHandler = useCallback(() => {
    Actions.updateHistory(
      editRecordHistory,
      tmpEditRecord,
      {
        ...tmpEditRecordHistory,
        patternCodeList: selectedPattern.map((pattern) => pattern.code),
      },
      useFunction
    );
  }, [
    Actions,
    editRecordHistory,
    tmpEditRecord,
    tmpEditRecordHistory,
    useFunction,
    selectedPattern,
  ]);

  const removeHandler = useCallback(() => {
    Actions.remove(
      tmpEditRecord.id,
      companyId,
      { ...originalCondition, companyId },
      sortOrder,
      limitPerPage,
      isOverLimit
    );
  }, [
    Actions,
    tmpEditRecord.id,
    companyId,
    originalCondition,
    sortOrder,
    limitPerPage,
    isOverLimit,
  ]);

  const removeHistoryHandler = useCallback(() => {
    const offsetCode = offsetCodes[currentPage - 1];
    const pagingCondition = { offsetCode, currentPage };
    const condition = {
      searchCondition: { ...originalCondition, companyId },
      sortOrder,
      chunkSize: limitPerPage,
      isOverLimit,
      changeSort: false,
      pagingCondition,
    };
    Actions.removeHistory(editRecordHistory, condition);
  }, [
    Actions,
    companyId,
    currentPage,
    editRecordHistory,
    isOverLimit,
    limitPerPage,
    offsetCodes,
    originalCondition,
    sortOrder,
  ]);

  const startEditingBaseHandler = useCallback(() => {
    Actions.startEditingBase(editRecord, editRecordHistory);
  }, [Actions, editRecord, editRecordHistory]);

  const startCloneHandler = useCallback(() => {
    UIListActions.setSelectedRowIndex(-1);
    Actions.startCloneEditingBase(editRecord, editRecordHistory);
  }, [Actions, UIListActions, editRecord, editRecordHistory]);

  const startEditingHistoryHandler = useCallback(
    (param: { targetDate: string; comment: string }) => {
      Actions.startEditingHistory({
        ...tmpEditRecordHistory,
        validDateFrom: param.targetDate,
        comment: param.comment,
      });
    },
    [Actions, tmpEditRecordHistory]
  );

  const cancelEditingHandler = useCallback(() => {
    Actions.cancelEditing(
      editRecord,
      editRecordHistory,
      orginalSelectedPattern
    );
  }, [Actions, editRecord, editRecordHistory, orginalSelectedPattern]);

  const changeDisplayingHistoryHandler = useCallback(
    (id: string) => {
      Actions.changeDisplayingHistory(id, recordHistoryList);
    },
    [Actions, recordHistoryList]
  );

  const showRevisionDialog = useCallback(() => {
    RevisionDialogActions.showRevisionDialog();
  }, [RevisionDialogActions]);

  const closeDetailPanelHandler = useCallback(() => {
    UIListActions.setSelectedRowIndex(-1);
    PanelActions.closeDetailPanel();
  }, [PanelActions, UIListActions]);

  const patternCodes = useMemo(() => {
    if (!tmpEditRecordHistory.patternCodeList) {
      return [];
    } else {
      return tmpEditRecordHistory.patternCodeList;
    }
  }, [tmpEditRecordHistory.patternCodeList]);

  const init = useCallback(() => {
    $init(
      { ...initCondition, companyId, workSystem, codes: patternCodes },
      sortCondition
    );
  }, [$init, companyId, patternCodes, workSystem]);

  useEffect(() => {
    init();
  }, [init]);

  return (
    <Component // Header title
      // @ts-ignore
      title={title} // Display mode
      modeBase={modeBase}
      modeHistory={modeHistory} // Opening flag of Revision Dialog
      isShowDialog={isShowRevisionDialog} // Config list
      configList={configList} // Editing Records
      editRecord={editRecord}
      editRecordHistory={editRecordHistory}
      tmpEditRecord={tmpEditRecord}
      tmpEditRecordHistory={tmpEditRecordHistory} // From option's values
      getOrganizationSetting={getOrganizationSetting}
      sfObjFieldValues={sfObjFieldValues} // History records
      searchHistory={recordHistoryList} // Selected history record
      currentHistory={selectedHistoryId} // Feature flags
      useFunction={useFunction} // Handlers
      onChangeDetailItem={changeRecordValueHandler}
      onChangeDetailItemHistory={changeRecordHistoryValueHandler}
      onChangeHistory={changeDisplayingHistoryHandler}
      onClickCancelButton={closeDetailPanelHandler}
      onClickCancelEditButton={cancelEditingHandler}
      onClickDeleteButton={removeHandler}
      onClickDeleteHistoryButton={removeHistoryHandler}
      onClickEditDetailButton={startEditingBaseHandler}
      onClickRevisionButton={showRevisionDialog}
      onClickRevisionStartButton={startEditingHistoryHandler}
      onClickSaveButton={createHandler}
      onClickUpdateButton={updateBaseHandler}
      onClickCreateHistoryButton={appendHistoryHandler}
      onClickUpdateHistoryButton={updateHistoryHandler}
      onClickCloneButton={startCloneHandler} // Options of Displaying
      renderDetailExtraArea={() => {}}
      showCloneButton={true}
      isSinglePane={false}
    />
  );
};

export default DetailContainer;
