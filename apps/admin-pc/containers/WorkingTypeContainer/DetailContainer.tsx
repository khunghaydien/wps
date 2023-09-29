import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { bindActionCreators } from 'redux';

import configList from '../../constants/configList/workingType';
import { FunctionTypeList } from '../../constants/functionType';

import * as DetailActions from '../../action-dispatchers/working-type/detail';
import * as $PanelActions from '../../action-dispatchers/working-type/panel';
import * as $RevisionDialogActions from '../../action-dispatchers/working-type/revisionDialog';

import { State } from '../../reducers';

import Component from '../../presentational-components/WorkingType/MainContents/DetailPane';

const { useMemo, useCallback } = React;

const DetailContainer = ({
  title,
  useFunction,
}: {
  title: string;
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
  } = useSelector((state: State) => ({
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
  }));
  const dispatch = useDispatch();
  const Actions = useMemo(
    () => bindActionCreators(DetailActions, dispatch),
    [dispatch]
  );
  const PanelActions = useMemo(
    () => bindActionCreators($PanelActions, dispatch),
    [dispatch]
  );
  const RevisionDialogActions = useMemo(
    () => bindActionCreators($RevisionDialogActions, dispatch),
    [dispatch]
  );
  const createHandler = useCallback(() => {
    Actions.create(
      editRecord,
      editRecordHistory,
      tmpEditRecord,
      tmpEditRecordHistory,
      useFunction,
      searchCondition,
      companyId
    );
  }, [
    Actions,
    editRecord,
    editRecordHistory,
    tmpEditRecord,
    tmpEditRecordHistory,
    searchCondition,
    companyId,
    useFunction,
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
    Actions.updateBase(
      editRecord,
      tmpEditRecord,
      tmpEditRecordHistory,
      useFunction,
      searchCondition,
      companyId
    );
  }, [
    Actions,
    editRecord,
    tmpEditRecord,
    tmpEditRecordHistory,
    searchCondition,
    companyId,
    useFunction,
  ]);
  const appendHistoryHandler = useCallback(() => {
    Actions.appendHistory(
      editRecord,
      tmpEditRecord,
      tmpEditRecordHistory,
      useFunction,
      companyId
    );
  }, [
    Actions,
    editRecord,
    tmpEditRecord,
    tmpEditRecordHistory,
    useFunction,
    companyId,
  ]);
  const updateHistoryHandler = useCallback(() => {
    Actions.updateHistory(
      editRecordHistory,
      tmpEditRecord,
      tmpEditRecordHistory,
      useFunction,
      companyId
    );
  }, [
    Actions,
    editRecordHistory,
    tmpEditRecord,
    tmpEditRecordHistory,
    useFunction,
    companyId,
  ]);
  const removeHandler = useCallback(() => {
    Actions.remove(tmpEditRecord.id, companyId, searchCondition);
  }, [Actions, tmpEditRecord.id, companyId, searchCondition]);
  const removeHistoryHandler = useCallback(() => {
    Actions.removeHistory(editRecordHistory, searchCondition, companyId);
  }, [Actions, editRecordHistory, searchCondition, companyId]);
  const startEditingBaseHandler = useCallback(() => {
    Actions.startEditingBase(editRecord, editRecordHistory);
  }, [Actions, editRecord, editRecordHistory]);
  const startCloneHandler = useCallback(() => {
    Actions.startCloneEditingBase(editRecord, editRecordHistory);
  }, [Actions, editRecord, editRecordHistory]);
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
    Actions.cancelEditing(editRecord, editRecordHistory);
  }, [Actions, editRecord, editRecordHistory]);
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
    PanelActions.closeDetailPanel();
  }, [PanelActions]);

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
