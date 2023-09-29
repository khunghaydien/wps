import * as React from 'react';

import styled from 'styled-components';

import DialogFrame from '../../../commons/components/dialogs/DialogFrame';
import CommentNarrowField from '../../../commons/components/fields/CommentNarrowField';
import msg from '../../../commons/languages';

import { Status } from '../../../domain/models/approval/request/Status';

import Button from './atoms/Button';
import SubmitButton from './TrackSummary/SubmitButton';

import './RequestDialog.scss';

const { useCallback } = React;
const ROOT = 'tracking-pc-request-dialog';

type Props = Readonly<{
  comment: string;
  userPhotoUrl: string;
  status: Status;
  onChangeComment: (comment: string) => void;
  onClickClose: () => void;
  onClickSubmit: () => Promise<void>;
}>;

const StyledButton = styled<any>(Button)`
  margin: 0 8px 0 0;
`;

export default function RequestDialog({
  comment,
  userPhotoUrl,
  status,
  onChangeComment,
  onClickClose,
  onClickSubmit,
}: Props) {
  const onChangeCommentHandler = useCallback(
    (value: string) => onChangeComment(value),
    []
  );
  return (
    <div className={`${ROOT}`}>
      <DialogFrame
        className={`${ROOT}__dialog-frame`}
        title={msg().Trac_Lbl_Request}
        hide={onClickClose}
        footer={
          <DialogFrame.Footer>
            <StyledButton onClick={onClickClose}>
              {msg().Com_Btn_Cancel}
            </StyledButton>
            <SubmitButton status={status} onClick={onClickSubmit} />
          </DialogFrame.Footer>
        }
      >
        <div className={`${ROOT}__inner`}>
          <CommentNarrowField
            onChange={onChangeCommentHandler}
            value={comment}
            icon={userPhotoUrl}
          />
        </div>
      </DialogFrame>
    </div>
  );
}
