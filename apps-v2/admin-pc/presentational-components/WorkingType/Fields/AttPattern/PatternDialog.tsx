import React from 'react';

import styled from 'styled-components';

import { Dialog } from '@apps/core';

import { WorkSystemType } from '@attendance/domain/models/WorkingType';

import Footer from './Footer';
import Header from './Header';

const Wrapper = styled.div`
  width: 65vw;
  min-width: 800px;
`;

type Props = {
  isOpen: boolean;
  workSystem: WorkSystemType;
  onClose: () => void;
  onClickSaveButton: () => void;
  ContentContainer: React.FC<{
    isOpen: boolean;
    workSystem: WorkSystemType;
  }>;
};

const PatternDialog: React.FC<Props> = ({
  isOpen,
  workSystem,
  onClose,
  onClickSaveButton,
  ContentContainer,
}) => {
  return (
    <Wrapper>
      <Dialog
        isModal
        onClose={onClose}
        header={<Header />}
        content={<ContentContainer isOpen={isOpen} workSystem={workSystem} />}
        footer={<Footer onCancel={onClose} onSubmit={onClickSaveButton} />}
      />
    </Wrapper>
  );
};

export default PatternDialog;
