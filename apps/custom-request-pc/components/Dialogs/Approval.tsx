import React, { useState } from 'react';

import styled from 'styled-components';

import Button from '@apps/commons/components/buttons/Button';
import DialogFrame from '@apps/commons/components/dialogs/DialogFrame';
import TextAreaField from '@apps/commons/components/fields/TextAreaField';
import msg from '@apps/commons/languages';

export const StyledFrame = {
  Dialog: styled(DialogFrame)`
    width: 600px;
    .commons-dialog-frame__contents {
      padding: 10px;
    }
  `,
};

export type Props = {
  title?: string;
  btnLabel?: string;
  onHide: () => void;
  onClickMainButton: (comment: string) => void;
};

const Dialog = (props: Props) => {
  const { title = msg().Exp_Lbl_Request, btnLabel = msg().Com_Btn_Request } =
    props;
  const [comment, setComment] = useState('');
  const onClickMainButton = () => {
    props.onClickMainButton(comment);
  };
  const onChangeComment = (e) => setComment(e.target.value);
  return (
    <StyledFrame.Dialog
      title={title}
      hide={props.onHide}
      footer={
        <DialogFrame.Footer>
          <Button onClick={props.onHide}>{msg().Com_Btn_Close}</Button>
          <Button type={'primary'} onClick={onClickMainButton}>
            {btnLabel}
          </Button>
        </DialogFrame.Footer>
      }
    >
      <TextAreaField
        placeholder={msg().Appr_Lbl_SubmitComment}
        onChange={onChangeComment}
        value={comment}
        maxLength={1000}
        minRows={5}
      />
    </StyledFrame.Dialog>
  );
};

export default Dialog;
