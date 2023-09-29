import React from 'react';

import Button from '../../../commons/components/buttons/Button';
import DialogFrame from '../../../commons/components/dialogs/DialogFrame';
import CommentNarrowField from '../../../commons/components/fields/CommentNarrowField';
import msg from '../../../commons/languages';

import './ApprovalDialog.scss';

const ROOT = 'ts-modal-bulk-approval-dialog';

/**
 * This dialog is currently used only for bulk approval,
 * but can be used where we need to add comment before submit action
 */
type Props = {
  comment?: string;
  title: string;
  mainButtonTitle?: string;
  photoUrl?: string;
  additionalMsg: string;
  onChangeComment?: Function;
  onClickHideDialogButton: () => void;
  onClickMainButton: (arg0) => void;
  isNotShowComment?: boolean;
  disableMainButton?: boolean;
};

const ApprovalDialog = (props: Props) => {
  return (
    <DialogFrame
      title={props.title}
      hide={props.onClickHideDialogButton}
      className={`${ROOT}__dialog-frame`}
      footer={
        <DialogFrame.Footer>
          <Button
            type="default"
            data-testid={`${ROOT}-cancel`}
            onClick={props.onClickHideDialogButton}
          >
            {msg().Com_Btn_Cancel}
          </Button>
          <Button
            type="primary"
            data-testid={`${ROOT}-main`}
            onClick={props.onClickMainButton}
            disabled={props.disableMainButton}
          >
            {props.mainButtonTitle}
          </Button>
        </DialogFrame.Footer>
      }
    >
      <div className={`${ROOT}__msg`}>{props.additionalMsg}</div>
      {!props.isNotShowComment && (
        <div className={`${ROOT}__inner`}>
          <CommentNarrowField
            onChange={props.onChangeComment}
            value={props.comment}
            maxLength={1000}
            icon={props.photoUrl}
          />
        </div>
      )}
    </DialogFrame>
  );
};

export default ApprovalDialog;
