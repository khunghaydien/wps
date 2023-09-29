import React from 'react';

import styled from 'styled-components';

import msg from '@apps/commons/languages';
import { Button } from '@apps/core';

type Props = {
  onClose: () => void;
  onSave: () => void;
};

const S = {
  Footer: styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding: 0 20px;
    height: 60px;
    background: #f4f6f9;
    border-radius: 0 0 4px 4px;
  `,
  Button: styled(Button)`
    padding: 0 16px;
    margin-left: 16px;
  `,
};

const Footer: React.FC<Props> = ({ onClose, onSave }) => {
  return (
    <S.Footer>
      <S.Button onClick={onClose}>{msg().Com_Btn_Cancel}</S.Button>
      <S.Button onClick={onSave} color="primary">
        {msg().Com_Btn_Save}
      </S.Button>
    </S.Footer>
  );
};

export default Footer;
