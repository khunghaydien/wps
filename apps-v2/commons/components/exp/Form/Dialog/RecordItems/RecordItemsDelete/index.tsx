import React from 'react';

import iconConfirm from '../../../../../../images/iconConfirm.png';
import msg from '../../../../../../languages';
import Button from '../../../../../buttons/Button';
import DialogFrame from '../../../../../dialogs/DialogFrame';

import './index.scss';

const ROOT = 'ts-expenses-modal-record-items__delete';

type Props = {
  onClickHideDialogButton: () => void;
  onClickRemoveAll: () => Promise<any>;
};
export default class RecordItemsCreateDialog extends React.Component<Props> {
  render() {
    return (
      <DialogFrame
        title={msg().Com_Lbl_Confirm}
        hide={this.props.onClickHideDialogButton}
        className={`${ROOT}__dialog-frame`}
        footer={
          <DialogFrame.Footer>
            <Button type="default" onClick={this.props.onClickHideDialogButton}>
              {msg().Com_Btn_Cancel}
            </Button>
            <Button type="primary" onClick={this.props.onClickRemoveAll}>
              {msg().Com_Btn_Ok}
            </Button>
          </DialogFrame.Footer>
        }
      >
        <div className={`${ROOT}__inner`}>
          <img
            className={`${ROOT}__confirm-img`}
            src={iconConfirm}
            alt="Confirm"
          />
          {msg().Exp_Msg_ConfirmDelete}
        </div>
      </DialogFrame>
    );
  }
}
