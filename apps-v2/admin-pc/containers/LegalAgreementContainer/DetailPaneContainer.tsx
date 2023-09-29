import React, { useCallback } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import { FunctionTypeList } from '../../constants/functionType';

import DetailActions from '../../action-dispatchers/legal-agreement/detail';
import PanelActions from '../../action-dispatchers/legal-agreement/panel';
import RevisionActions from '../../action-dispatchers/legal-agreement/revisionDialog';
import { searchLegalAgreementGroup } from '../../actions/attLegalAgreementGroup';
import { getConstantsLegalAgreement } from '../../actions/legalAgreement';

import { State } from '../../reducers';

import DetailPane from '../../presentational-components/LegalAgreement/DetailPane';

type OwnProps = {
  useFunction: FunctionTypeList;
};

const mapStateToProps = (state: State) => ({
  isShowRevisionDialog: state.detailPane.ui.isShowRevisionDialog,
  modeBase: state.detailPane.ui.modeBase,
  modeHistory: state.detailPane.ui.modeHistory,
  editRecord: state.editRecord,
  editRecordHistory: state.editRecordHistory,
  tmpEditRecord: state.tmpEditRecord,
  tmpEditRecordHistory: state.tmpEditRecordHistory,
  recordHistoryList: state.searchHistory,
  selectedHistoryId: state.legalAgreement.ui.detail.selectedHistoryId,
  companyId: state.base.menuPane.ui.targetCompanyId,
  sfObjFieldValues: state.sfObjFieldValues,
  getOrganizationSetting: state.getOrganizationSetting,
  searchCondition: state.legalAgreement.ui.searchCondition,
  event: state.legalAgreement.ui.detail.limitEvent,
  specialEvent: state.legalAgreement.ui.detail.specialEvent,
});

const DetailPaneContainer: React.FC<OwnProps> = ({ useFunction }) => {
  const dispatch = useDispatch() as ThunkDispatch<State, void, AnyAction>;
  const detailActions = DetailActions(dispatch);
  const panelAcions = PanelActions(dispatch);
  const revisionAcions = RevisionActions(dispatch);

  const stateProps = useSelector(mapStateToProps, shallowEqual);
  const {
    editRecord,
    editRecordHistory,
    tmpEditRecord,
    tmpEditRecordHistory,
    searchCondition,
    companyId,
    recordHistoryList,
    selectedHistoryId,
    event,
    specialEvent,
  } = stateProps;

  const createHandler = useCallback(() => {
    detailActions.create(
      editRecord,
      editRecordHistory,
      tmpEditRecord,
      tmpEditRecordHistory,
      useFunction,
      searchCondition,
      companyId,
      event,
      specialEvent
    );
  }, [
    detailActions,
    editRecord,
    editRecordHistory,
    tmpEditRecord,
    tmpEditRecordHistory,
    searchCondition,
    companyId,
    useFunction,
    event,
    specialEvent,
  ]);

  const changeRecordValueHandler = useCallback(
    (key: string, value: any, charType?: string) => {
      detailActions.changeRecordValue(key, value, charType);
    },
    [detailActions]
  );

  const changeRecordHistoryValueHandler = useCallback(
    (key: string, value: any, charType?: string) => {
      detailActions.changeRecordHistoryValue(key, value, charType);
    },
    [detailActions]
  );

  const updateBaseHandler = useCallback(() => {
    detailActions.updateBase(
      editRecord,
      tmpEditRecord,
      tmpEditRecordHistory,
      useFunction,
      searchCondition,
      companyId
    );
  }, [
    detailActions,
    editRecord,
    tmpEditRecord,
    tmpEditRecordHistory,
    searchCondition,
    companyId,
    useFunction,
  ]);

  const appendHistoryHandler = useCallback(() => {
    detailActions.appendHistory(
      editRecord,
      tmpEditRecord,
      tmpEditRecordHistory,
      useFunction,
      companyId,
      event,
      specialEvent
    );
  }, [
    detailActions,
    editRecord,
    tmpEditRecord,
    tmpEditRecordHistory,
    useFunction,
    companyId,
    event,
    specialEvent,
  ]);

  const updateHistoryHandler = useCallback(() => {
    detailActions.updateHistory(
      editRecordHistory,
      tmpEditRecord,
      tmpEditRecordHistory,
      useFunction,
      companyId
    );
  }, [
    detailActions,
    editRecordHistory,
    tmpEditRecord,
    tmpEditRecordHistory,
    useFunction,
    companyId,
  ]);

  const removeHandler = useCallback(() => {
    detailActions.remove(tmpEditRecord.id, companyId, searchCondition);
  }, [detailActions, tmpEditRecord.id, companyId, searchCondition]);

  const removeHistoryHandler = useCallback(() => {
    detailActions.removeHistory(editRecordHistory, searchCondition, companyId);
  }, [detailActions, editRecordHistory, searchCondition, companyId]);

  const startEditingBaseHandler = useCallback(() => {
    detailActions.startEditingBase(editRecord, editRecordHistory);
  }, [detailActions, editRecord, editRecordHistory]);

  const startEditingHistoryHandler = useCallback(
    (param: { targetDate: string; comment: string }) => {
      detailActions.startEditingHistory({
        ...tmpEditRecordHistory,
        validDateFrom: param.targetDate,
        comment: param.comment,
      });
    },
    [detailActions, tmpEditRecordHistory]
  );

  const cancelEditingHandler = useCallback(() => {
    detailActions.cancelEditing(editRecord, editRecordHistory);
  }, [detailActions, editRecord, editRecordHistory]);

  const changeDisplayingHistoryHandler = useCallback(
    (id: string) => {
      detailActions.changeDisplayingHistory(id, recordHistoryList);
    },
    [detailActions, recordHistoryList]
  );

  const showRevisionDialog = useCallback(() => {
    revisionAcions.showRevisionDialog();
  }, [revisionAcions]);

  const closeDetailPanelHandler = useCallback(() => {
    panelAcions.closeDetailPanel();
  }, [panelAcions]);

  const getConstants = useCallback(() => {
    dispatch(getConstantsLegalAgreement());
  }, [dispatch]);

  const searchGroup = useCallback(() => {
    dispatch(searchLegalAgreementGroup({ companyId }));
  }, [companyId, dispatch]);

  return (
    <DetailPane
      {...stateProps}
      currentHistory={selectedHistoryId}
      isSinglePane={false}
      searchHistory={recordHistoryList}
      useFunction={useFunction}
      getConstants={getConstants}
      searchGroup={searchGroup}
      onClickRevisionButton={showRevisionDialog}
      onClickSaveButton={createHandler}
      onChangeDetailItem={changeRecordValueHandler}
      onChangeDetailItemHistory={changeRecordHistoryValueHandler}
      onClickUpdateButton={updateBaseHandler}
      onClickCreateHistoryButton={appendHistoryHandler}
      onClickUpdateHistoryButton={updateHistoryHandler}
      onClickDeleteButton={removeHandler}
      onClickDeleteHistoryButton={removeHistoryHandler}
      onClickEditDetailButton={startEditingBaseHandler}
      onClickRevisionStartButton={startEditingHistoryHandler}
      onClickCancelEditButton={cancelEditingHandler}
      onChangeHistory={changeDisplayingHistoryHandler}
      onClickCancelButton={closeDetailPanelHandler}
    />
  );
};

export default DetailPaneContainer;
