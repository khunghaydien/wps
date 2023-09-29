import React, { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { bindActionCreators } from 'redux';

import get from 'lodash/get';
import { createSelector } from 'reselect';

import { State } from '@custom-request-pc/modules';

import { submitRequest } from '@custom-request-pc/action-dispatchers';

import Component from '@custom-request-pc/components/Dialogs/Approval';

import { relatedList } from '@custom-request-pc/consts';
import { LayoutDetail } from '@custom-request-pc/types';

const mapStateToProps = (_state: State) => ({});

const ApprovalContainer = (ownProps) => {
  const props = useSelector(mapStateToProps);
  const dispatch = useDispatch();
  const Actions = useMemo(
    () =>
      bindActionCreators(
        {
          submitRequest,
        },
        dispatch
      ),
    [dispatch]
  );
  const selectedId = useSelector((state: State) => state.ui.selectedId);

  const getRelatedList = createSelector(
    (state: State) => state.ui.layoutDetailInfo,
    (layoutDetail: LayoutDetail) =>
      layoutDetail.relatedLists.map((x) => get(x, 'sobject'))
  );
  const getFileDisplayConfig = createSelector(getRelatedList, (relatedLists) =>
    relatedLists.includes(relatedList.FILE_LIST)
  );
  const getHistoryDisplayConfig = createSelector(
    getRelatedList,
    (relatedLists) => relatedLists.includes(relatedList.HISTORY_LIST)
  );
  const isShownFile = useSelector((state: State) =>
    getFileDisplayConfig(state)
  );
  const isShownHistory = useSelector((state: State) =>
    getHistoryDisplayConfig(state)
  );

  const layoutConfig = useSelector(
    (state: State) => state.ui.layoutConfig.config
  );
  const sObjName = useSelector(
    (state: State) => state.ui.layoutConfig.sObjName
  );
  const selectedRecordTypeId = useSelector(
    (state: State) => state.ui.selectedRecordTypeId
  );
  const onClickMainButton = (comment: string) => {
    Actions.submitRequest(
      selectedId,
      comment,
      layoutConfig.map(({ field }) => field),
      isShownFile,
      isShownHistory,
      sObjName,
      selectedRecordTypeId
    )
      // @ts-ignore
      .then((success: boolean) => {
        if (success) {
          ownProps.onHide();
        }
      });
  };

  return (
    <Component {...props} {...ownProps} onClickMainButton={onClickMainButton} />
  );
};

export default ApprovalContainer;
