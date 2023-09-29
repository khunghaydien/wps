import React from 'react';

import styled from 'styled-components';

import msg from '@apps/commons/languages';
import { Button } from '@apps/core';

type Props = {
  onClose: () => void;
  onApply: () => void;
};

const FootWrapper = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 10px 20px;
`;

const CloseButton = styled(Button)`
  margin-right: 16px;
`;

const Footer: React.FC<Props> = ({ onClose, onApply }) => {
  return (
    <FootWrapper>
      <CloseButton onClick={onClose}>{msg().Com_Btn_Cancel}</CloseButton>
      <Button color="primary" onClick={onApply}>
        {msg().Time_Btn_Import}
      </Button>
    </FootWrapper>
  );
};

export default Footer;
