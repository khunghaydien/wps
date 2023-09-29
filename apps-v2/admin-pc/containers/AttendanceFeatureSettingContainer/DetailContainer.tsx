import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { bindActionCreators } from 'redux';

import configList from '../../constants/configList/attendanceFeatureSetting';
import { FunctionTypeList } from '../../constants/functionType';

import * as DetailActions from '../../action-dispatchers/feature-setting/detail';
import * as $PanelActions from '../../action-dispatchers/feature-setting/panel';
import * as $RevisionDialogActions from '../../action-dispatchers/feature-setting/revisionDialog';

import { State } from '../../reducers';

import Component from '../../presentational-components/AttendanceFeatureSetting/MainContents/DetailPane';

const DetailContainer = ({
  useFunction,
}: {
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
    tempOpsRecordAggregate,
  } = useSelector((state: State) => ({
    isShowRevisionDialog: state.detailPane.ui.isShowRevisionDialog,
    modeBase: state.detailPane.ui.modeBase,
    modeHistory: state.detailPane.ui.modeHistory,
    editRecord: state.editRecord,
    editRecordHistory: state.editRecordHistory,
    tmpEditRecord: state.tmpEditRecord,
    tmpEditRecordHistory: state.tmpEditRecordHistory,
    recordHistoryList: state.searchHistory,
    selectedHistoryId: state.featureSetting.ui.detail.selectedHistoryId,
    companyId: state.base.menuPane.ui.targetCompanyId,
    sfObjFieldValues: state.sfObjFieldValues,
    getOrganizationSetting: state.getOrganizationSetting,
    searchCondition: state.featureSetting.ui.searchCondition,
    tempOpsRecordAggregate:
      state.featureSetting.ui.detail.TempOpsRecordAggregate,
  }));
  const dispatch = useDispatch();
  const Actions = React.useMemo(
    () => bindActionCreators(DetailActions, dispatch),
    [dispatch]
  );
  const PanelActions = React.useMemo(
    () => bindActionCreators($PanelActions, dispatch),
    [dispatch]
  );
  const RevisionDialogActions = React.useMemo(
    () => bindActionCreators($RevisionDialogActions, dispatch),
    [dispatch]
  );
  const createHandler = React.useCallback(() => {
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
  const changeRecordValueHandler = React.useCallback(
    (key: string, value: any, charType?: string) => {
      Actions.changeRecordValue(key, value, charType);
    },
    [Actions]
  );
  const changeRecordHistoryValueHandler = React.useCallback(
    (key: string, value: any, charType?: string) => {
      Actions.changeRecordHistoryValue(key, value, charType);
    },
    [Actions]
  );
  const updateBaseHandler = React.useCallback(() => {
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
  const appendHistoryHandler = React.useCallback(() => {
    Actions.appendHistory(
      editRecord,
      tmpEditRecord,
      tmpEditRecordHistory,
      useFunction,
      companyId,
      tempOpsRecordAggregate
    );
  }, [
    Actions,
    editRecord,
    tmpEditRecord,
    tmpEditRecordHistory,
    useFunction,
    companyId,
    tempOpsRecordAggregate,
  ]);
  const removeHistoryHandler = React.useCallback(() => {
    Actions.removeHistory(editRecordHistory, searchCondition, companyId);
  }, [Actions, editRecordHistory, searchCondition, companyId]);
  const startEditingBaseHandler = React.useCallback(() => {
    Actions.startEditingBase(editRecord, editRecordHistory);
  }, [Actions, editRecord, editRecordHistory]);
  const startEditingHistoryHandler = React.useCallback(
    (param: { targetDate: string; comment: string }) => {
      Actions.startEditingHistory({
        ...tmpEditRecordHistory,
        validDateFrom: param.targetDate,
        historyComment: param.comment,
      });
    },
    [Actions, tmpEditRecordHistory]
  );
  const cancelEditingHandler = React.useCallback(() => {
    Actions.cancelEditing(editRecord, companyId);
  }, [Actions, editRecord, companyId]);
  const changeDisplayingHistoryHandler = React.useCallback(
    (id: string) => {
      Actions.changeDisplayingHistory(id, recordHistoryList);
    },
    [Actions, recordHistoryList]
  );
  const showRevisionDialog = React.useCallback(() => {
    RevisionDialogActions.showRevisionDialog();
  }, [RevisionDialogActions]);
  const closeDetailPanelHandler = React.useCallback(() => {
    PanelActions.closeDetailPanel();
  }, [PanelActions]);
  return (
    <Component
      modeBase={modeBase}
      modeHistory={modeHistory}
      isShowDialog={isShowRevisionDialog}
      configList={configList}
      editRecord={editRecord}
      editRecordHistory={editRecordHistory}
      tmpEditRecord={tmpEditRecord}
      tmpEditRecordHistory={tmpEditRecordHistory}
      getOrganizationSetting={getOrganizationSetting}
      sfObjFieldValues={sfObjFieldValues}
      searchHistory={recordHistoryList}
      currentHistory={selectedHistoryId}
      useFunction={useFunction}
      onChangeDetailItem={changeRecordValueHandler}
      onChangeDetailItemHistory={changeRecordHistoryValueHandler}
      onChangeHistory={changeDisplayingHistoryHandler}
      onClickCancelButton={closeDetailPanelHandler}
      onClickCancelEditButton={cancelEditingHandler}
      onClickDeleteHistoryButton={removeHistoryHandler}
      onClickEditDetailButton={startEditingBaseHandler}
      onClickRevisionButton={showRevisionDialog}
      onClickRevisionStartButton={startEditingHistoryHandler}
      onClickSaveButton={createHandler}
      onClickUpdateButton={updateBaseHandler}
      onClickCreateHistoryButton={appendHistoryHandler}
      isSinglePane={false}
    />
  );
};

export default DetailContainer;
