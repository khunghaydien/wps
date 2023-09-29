import React from 'react';

import styled from 'styled-components';

import msg from '@apps/commons/languages';
import $DialogFrame from '@commons/components/dialogs/DialogFrame';

import { Props as ContentProps } from '../../../containers/EmployeeContainer/CustomFields/WorkingType/ContentContainer';

import Footer from './Footer';

const DialogFrame = styled($DialogFrame)`
  width: 65vw;
  min-width: 800px;
`;

type Props = {
  targetDate: string;
  companyId: string;
  onClose: () => void;
  onClickSaveButton: () => void;
  ContentContainer: React.FC<ContentProps>;
};

const PatternDialog: React.FC<Props> = ({
  targetDate,
  companyId,
  onClose,
  onClickSaveButton,
  ContentContainer,
}) => {
  return (
    <DialogFrame
      title={msg().Admin_Lbl_WorkingTypeSelect}
      hide={onClose}
      footer={<Footer onCancel={onClose} onSubmit={onClickSaveButton} />}
    >
      <ContentContainer companyId={companyId} targetDate={targetDate} />
    </DialogFrame>
  );
};

export default PatternDialog;
