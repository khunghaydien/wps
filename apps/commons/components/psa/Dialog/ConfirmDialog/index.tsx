// NOTE:
// In case of directly calling confirm dialog from container, Confirm dialog is called via this component.
// In other cases, should use common/dialog/ConfirmDialog directly.
import React from 'react';

import ConfirmDialog from '../../../dialogs/ConfirmDialog';

type Props = {
  className?: string | null;
  message: string;
  onClickCancel: () => void;
  onClickOk: () => void;
};

const PSAConfirmDialog = (props: Props) => (
  <ConfirmDialog
    className={props.className}
    onClickCancel={props.onClickCancel}
    onClickHide={props.onClickCancel}
    onClickOk={props.onClickOk}
    withoutCloseButton={false}
  >
    {props.message}
  </ConfirmDialog>
);

PSAConfirmDialog.defaultProps = {
  className: '',
};

export default PSAConfirmDialog;
