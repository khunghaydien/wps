import React from 'react';

import styled from 'styled-components';

import { Dialog } from '@apps/core';

import Header from './Header';

type Props = {
  onClose: () => void;
  onClickSaveButton: () => void;
  children: React.ReactNode;
};

const Wrapper = styled.div`
  width: 65vw;
  min-width: 1200px;
`;

const DialogFrame: React.FC<Props> = ({
  onClose,
  onClickSaveButton,
  children,
}: Props) => {
  return (
    <Wrapper>
      <Dialog
        isModal
        onClose={onClose}
        header={<Header onClickSaveButton={onClickSaveButton} />}
        content={children}
      />
    </Wrapper>
  );
};

export default DialogFrame;
