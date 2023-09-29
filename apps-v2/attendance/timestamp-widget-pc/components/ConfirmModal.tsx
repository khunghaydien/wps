import * as React from 'react';

import styled from 'styled-components';

import msg from '../../../commons/languages';
import TextUtil from '../../../commons/utils/TextUtil';
import Button from '../../../core/elements/Button';

type Props = {
  onClickCancelButton: () => void;
  onClickSubmitButton: () => void;
  insufficientRestTime: number;
};

const MessageTextContainer = styled.div`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
`;

const CancelButton = styled(Button)`
  padding: 0 17px;
  margin-right: 16px;
  max-height: 32px;
`;

const SubmitButton = styled(Button)`
  padding: 0 17px;
  max-height: 32px;
`;

const ButtonContainer = styled.div`
  position: absolute;
  display: flex;
  justify-content: flex-end;
  bottom: 0;
  right: 0;
`;

const ModalContainer = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #fff;
  opacity: 0.9;
  z-index: 100;
`;

const ConfirmModal = (props: Props) => (
  <ModalContainer>
    <MessageTextContainer>
      <p>
        {TextUtil.nl2br(
          TextUtil.template(
            msg().Com_Msg_InsufficientRestTimeInHomeWidget,
            props.insufficientRestTime
          )
        )}
      </p>
    </MessageTextContainer>
    <ButtonContainer>
      <CancelButton onClick={() => props.onClickCancelButton()}>
        {msg().Com_Btn_Cancel}
      </CancelButton>
      <SubmitButton color="primary" onClick={() => props.onClickSubmitButton()}>
        {msg().Com_Btn_Submit}
      </SubmitButton>
    </ButtonContainer>
  </ModalContainer>
);

export default ConfirmModal;
