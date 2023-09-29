import React from 'react';
import { useSelector } from 'react-redux';

import ConfirmDialog, {
  bindHandlerToConfirmDialog,
} from '@commons/components/dialogs/ConfirmDialog';

import { State } from '../modules';

const ConfirmDialogContainer: React.FC = () => {
  const confirmDialog = useSelector(
    (state: State) => state.common.app.confirmDialog
  );
  const { callback } = confirmDialog || {};
  const onClickOk = React.useCallback(() => callback(true), [callback]);
  const onClickCancel = React.useCallback(() => callback(false), [callback]);

  if (!confirmDialog) {
    return null;
  }

  if ('Component' in confirmDialog) {
    const { Component, params } = confirmDialog;
    const CommonConfirmBoundHandler = bindHandlerToConfirmDialog({
      onClickOk,
      onClickCancel,
    }) as React.ComponentType<typeof params>;
    return (
      <Component ConfirmDialog={CommonConfirmBoundHandler} params={params} />
    );
  }

  return (
    <ConfirmDialog onClickOk={onClickOk} onClickCancel={onClickCancel}>
      {confirmDialog.message}
    </ConfirmDialog>
  );
};

export default ConfirmDialogContainer;
