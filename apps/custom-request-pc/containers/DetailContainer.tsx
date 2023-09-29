import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { bindActionCreators } from 'redux';

import { get } from 'lodash';
import { createSelector } from 'reselect';

import { generateFieldAndValueMap } from '@custom-request-pc/models';

import { State } from '../modules';
import { actions as requestDetailActions } from '@custom-request-pc/modules/entities/requestDetail';
import { actions as activeDialogActions } from '@custom-request-pc/modules/ui/dialog/activeDialog';
import { actions as pageViewUIActions } from '@custom-request-pc/modules/ui/pageView';

import {
  cloneRequest,
  deleteRequests,
  initializeDialog,
} from '@custom-request-pc/action-dispatchers';

import Component from '../components/Detail';

import {
  AUTO_SET_FIELDS,
  availableButtons,
  pageView,
  relatedList,
} from '@custom-request-pc/consts';
import { LayoutDetail } from '@custom-request-pc/types';

const getRelatedList = createSelector(
  (state: State) => state.ui.layoutDetailInfo,
  (layoutDetail: LayoutDetail) =>
    layoutDetail.relatedLists.map((x) => get(x, 'sobject'))
);

const getFileDisplayConfig = createSelector(getRelatedList, (relatedLists) =>
  relatedLists.includes(relatedList.FILE_LIST)
);

const getHistoryDisplayConfig = createSelector(getRelatedList, (relatedLists) =>
  relatedLists.includes(relatedList.HISTORY_LIST)
);

const DetailContainer = () => {
  const dispatch = useDispatch();
  const layoutConfig = useSelector(
    (state: State) => state.ui.layoutConfig.config
  );
  const requestDetail = useSelector(
    (state: State) => state.entities.requestDetail
  );
  const selectedId = useSelector((state: State) => state.ui.selectedId);
  const isShownFile = useSelector((state: State) =>
    getFileDisplayConfig(state)
  );
  const isShownHistory = useSelector((state: State) =>
    getHistoryDisplayConfig(state)
  );

  const buttonsConfig = useSelector((state: State) => state.ui.buttonsConfig);
  const isShowClone = buttonsConfig.includes(availableButtons.CLONE);

  const selectedRecordTypeId = useSelector(
    (state: State) => state.ui.selectedRecordTypeId
  );
  const objectName = useSelector(
    (state: State) => state.entities.recordTypeList.objectName
  );
  const sObjName = useSelector(
    (state: State) => state.ui.layoutConfig.sObjName
  );
  const currencySymbol = useSelector(
    (state: State) => state.userSetting.sfCompanyDefaultCurrencyCode
  );

  const Actions = useMemo(
    () =>
      bindActionCreators(
        {
          setPageView: pageViewUIActions.setView,
          getRequestDetail: requestDetailActions.get,
          clearRequestDetail: requestDetailActions.clear,
          openApprovalDialog: activeDialogActions.approval,
          openRecallDialog: activeDialogActions.recall,
          deleteRequests,
          initializeDialog,
          openEditDialog: activeDialogActions.edit,
          cloneRequest,
        },
        dispatch
      ),
    [dispatch]
  );

  const onClickEdit = () => {
    Actions.initializeDialog(selectedRecordTypeId, objectName);
    Actions.openEditDialog();
  };

  useEffect(() => {
    if (selectedId) {
      Actions.getRequestDetail(
        selectedId,
        layoutConfig.map(({ field }) => field),
        isShownFile,
        isShownHistory
      );
    }
  }, [selectedId]);

  const onClickDelete = () => {
    Actions.deleteRequests(
      [selectedId],
      sObjName,
      layoutConfig.map(({ field }) => field),
      selectedRecordTypeId
    );
    Actions.setPageView(pageView.List);
  };

  const openRecallDialog = () => {
    Actions.openRecallDialog();
  };

  const onClickSubmit = () => {
    Actions.openApprovalDialog();
  };
  const onClickClone = () => {
    // remove auto set fields when clone
    const filtered = Object.keys(requestDetail.customRequest)
      .filter((key) => !AUTO_SET_FIELDS.includes(key))
      .reduce((obj, key) => {
        obj[key] = requestDetail.customRequest[key];
        return obj;
      }, {});

    const fieldsMap = layoutConfig.reduce((acc, { field, ...config }) => {
      acc[field] = config;
      return acc;
    }, {});
    const { value, fieldTypeMap } = generateFieldAndValueMap(
      filtered,
      fieldsMap,
      selectedRecordTypeId
    );
    Actions.cloneRequest(
      [value],
      fieldTypeMap,
      sObjName,
      layoutConfig.map(({ field }) => field),
      selectedRecordTypeId
    );
  };

  const onClickBack = () => {
    Actions.setPageView(pageView.List);
    Actions.clearRequestDetail();
  };

  return (
    <Component
      layoutConfig={layoutConfig}
      requestDetail={requestDetail}
      isShownFile={isShownFile}
      isShownHistory={isShownHistory}
      isShowClone={isShowClone}
      currencySymbol={currencySymbol}
      onClickList={onClickBack}
      openRecallDialog={openRecallDialog}
      onClickDelete={onClickDelete}
      onClickClone={onClickClone}
      onClickEdit={onClickEdit}
      onClickSubmit={onClickSubmit}
    />
  );
};

export default DetailContainer;
