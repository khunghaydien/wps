import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { selectors as historyListSelectors } from '../../../../widgets/dialogs/ApprovalHistoryDialog/modules/entities/historyList';
import { State } from '../modules';
import { actions as requestActions } from '../modules/ui/request';

import HistoryDialog from '../../../../widgets/dialogs/ApprovalHistoryDialog/components/Dialog';

const HistoryDialogContainer = () => {
  const historyList = useSelector(historyListSelectors.historyListSelector);
  const isOpen = useSelector<State, boolean>(
    (state) => state.ui.request.isOpenHistoryDialog
  );
  const dispatch = useDispatch();
  const onHide = useCallback(
    () => dispatch(requestActions.update({ isOpenHistoryDialog: false })),
    []
  );

  return (
    <>{isOpen && <HistoryDialog historyList={historyList} onHide={onHide} />}</>
  );
};

export default HistoryDialogContainer;
