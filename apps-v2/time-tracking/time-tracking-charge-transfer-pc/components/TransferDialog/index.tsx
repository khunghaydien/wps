import React from 'react';

import styled from 'styled-components';

import msg from '@apps/commons/languages';
import { Dialog } from '@apps/core';

import BlockScreen from './BlockScreen';
import Content from './Content';
import Footer from './Footer';

type Props = {
  onSave: () => void;
  onClose: () => void;
};

const Wrapper = styled.div`
  min-width: 900px;
`;

const TransferDialog: React.FC<Props> = ({ onClose, onSave }) => {
  return (
    <Wrapper>
      <Dialog
        data-testid="transfer-dialog"
        isModal
        title={msg().Trac_Lbl_TimeTrackingChargeTransfer}
        content={<Content />}
        footer={<Footer onClose={onClose} onSave={onSave} />}
        onClose={onClose}
      />
      <BlockScreen />
    </Wrapper>
  );
};

export default TransferDialog;
