import React from 'react';

import styled from 'styled-components';

import msg from '@apps/commons/languages';
import Button from '@commons/components/buttons/Button';

const FooterWrapper = styled.div`
  display: flex;
  align-items: center;
  align-content: center;
  height: 60px;
  padding: 0 16px;
  border-bottom: solid 1px #d8dde6;
  background: #f4f6f9;
  border-radius: 0 0 4px 4px;
  justify-content: flex-end;

  button {
    min-height: 32px;
    padding: 0 16px;
    margin-left: 16px;
  }
`;

type Props = {
  onCancel: () => void;
  onSubmit: () => void;
};

const Footer: React.FC<Props> = ({ onCancel, onSubmit }) => {
  return (
    <FooterWrapper>
      <Button onClick={onCancel}>{msg().Com_Btn_Cancel}</Button>
      <Button type="primary" onClick={onSubmit}>
        {msg().Com_Btn_Submit}
      </Button>
    </FooterWrapper>
  );
};

export default Footer;
