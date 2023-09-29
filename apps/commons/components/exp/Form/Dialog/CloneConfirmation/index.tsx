import React from 'react';

import iconConfirm from '../../../../../images/iconConfirm.png';
import msg from '../../../../../languages';
import Button from '../../../../buttons/Button';
import DialogFrame from '../../../../dialogs/DialogFrame';

import './index.scss';

const ROOT = 'ts-expenses-modal-clone-confirmation';

export type Props = {
  onClickCloneReport: () => void;
  onClickCloneRequest: (arg0: number) => void;
  onClickHideDialogButton: () => void;
};

const CloneConfirmationDialog = (props: Props) => {
  const { onClickHideDialogButton, onClickCloneRequest, onClickCloneReport } =
    props;

  return (
    <DialogFrame
      title={msg().Com_Lbl_Confirm}
      hide={onClickHideDialogButton}
      className={`${ROOT}__dialog-frame`}
      footer={
        <DialogFrame.Footer>
          <Button type="default" onClick={onClickHideDialogButton}>
            {msg().Com_Btn_Cancel}
          </Button>
          <Button type="primary" onClick={onClickCloneRequest}>
            {msg().Exp_Lbl_ExpRequest}
          </Button>
          <Button type="primary" onClick={onClickCloneReport}>
            {msg().Appr_Lbl_Expense}
          </Button>
        </DialogFrame.Footer>
      }
    >
      <div className={`${ROOT}__message`}>
        <div className={`${ROOT}__icon`}>
          <img src={iconConfirm} alt="INFO" />
        </div>
        <div data-testid={`${ROOT}__content`} className={`${ROOT}__content`}>
          <p>
            <span>{msg().Exp_Msg_ReportFromRequest}</span>
            <span> {msg().Exp_Msg_ReportCloneTypeSelect}</span>
          </p>
        </div>
      </div>
    </DialogFrame>
  );
};

export default CloneConfirmationDialog;
