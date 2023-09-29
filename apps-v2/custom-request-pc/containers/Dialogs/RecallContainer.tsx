import React, { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { bindActionCreators } from 'redux';

import get from 'lodash/get';
import { createSelector } from 'reselect';

import msg from '@commons/languages';

import { relatedList } from '@apps/domain/models/customRequest/consts';
import { LayoutDetail } from '@apps/domain/models/customRequest/types';

import { State } from '@custom-request-pc/modules';

import { recallRequest } from '@custom-request-pc/action-dispatchers';

import Component from '@custom-request-pc/components/Dialogs/Approval';

const mapStateToProps = (_state: State) => ({});

const RecallContainer = (ownProps) => {
  const props = useSelector(mapStateToProps);
  const dispatch = useDispatch();
  const Actions = useMemo(
    () =>
      bindActionCreators(
        {
          recallRequest,
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
  const userId = useSelector((state: State) => state.userSetting.id);

  const onClickMainButton = (comment: string) => {
    Actions.recallRequest(
      selectedId,
      comment,
      layoutConfig.map(({ field }) => field),
      isShownFile,
      isShownHistory,
      sObjName,
      selectedRecordTypeId,
      userId
    )
      // @ts-ignore
      .then((success: boolean) => {
        if (success) {
          ownProps.onHide();
        }
      });
  };

  return (
    <Component
      {...props}
      {...ownProps}
      onClickMainButton={onClickMainButton}
      title={msg().Exp_Lbl_Recall}
      btnLabel={msg().Exp_Lbl_Recall}
    />
  );
};

export default RecallContainer;
