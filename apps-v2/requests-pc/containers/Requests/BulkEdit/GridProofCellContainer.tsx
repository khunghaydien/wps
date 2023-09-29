import React, { ReactElement, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { bindActionCreators } from 'redux';

import GridProofCell, {
  ContainerProps,
} from '@commons/components/exp/Form/RecordList/BulkEdit/GridArea/GridProofCell';

import { RECORD_ATTACHMENT_MAX_COUNT } from '@apps/domain/models/exp/Record';

import { State } from '@apps/requests-pc/modules';
import { AppDispatch } from '@apps/requests-pc/modules/AppThunk';
import { dialogTypes } from '@apps/requests-pc/modules/ui/expenses/dialog/activeDialog';

import { openReceiptLibraryDialog } from '@apps/requests-pc/action-dispatchers/Dialog';

const GridProofCellContainer = (props: ContainerProps): ReactElement => {
  const dispatch = useDispatch() as AppDispatch;
  const activeDialogList = useSelector(
    (state: State) => state.ui.expenses.dialog.activeDialog
  );
  const isOpenReceiptLibraryDialog = activeDialogList.includes(
    dialogTypes.RECEIPTS
  );

  const Actions = useMemo(
    () =>
      bindActionCreators(
        {
          openReceiptLibraryDialog,
        },
        dispatch
      ),
    [dispatch]
  );

  const openReceiptLibrary = () => {
    Actions.openReceiptLibraryDialog(RECORD_ATTACHMENT_MAX_COUNT);
  };

  const ownProps = {
    ...props,
    isOpenReceiptLibraryDialog,
    openReceiptLibrary,
  };
  return <GridProofCell {...ownProps} />;
};

export default GridProofCellContainer;
