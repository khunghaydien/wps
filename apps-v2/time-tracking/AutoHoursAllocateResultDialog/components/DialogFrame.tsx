import React from 'react';

import styled from 'styled-components';

import msg from '@apps/commons/languages';
import { Dialog } from '@apps/core';

import Footer from './Footer';
import Header from './Header';

type Props = {
  empId: string;
  targetDate: string;
  timeOfAttendance: number | null | undefined;
  timeOfExternalTaskTime: number | null;
  selectedTime: number | null;
  onClose: () => void;
  onApply: () => void;
  children: React.ReactNode;
};

const Wrapper = styled.div`
  //width: calc(100vw - 40px);
  width: 1200px;
`;

const DialogFrame: React.FC<Props> = ({
  empId,
  targetDate,
  timeOfAttendance,
  timeOfExternalTaskTime,
  selectedTime,
  onClose,
  onApply,
  children,
}: Props) => {
  return (
    <Wrapper>
      <Dialog
        isModal
        title={msg().Time_Lbl_AutomaticWorkingHoursAllocation}
        onClose={onClose}
        header={
          <Header
            empId={empId}
            targetDate={targetDate}
            timeOfAttendance={timeOfAttendance}
            timeOfExternalTaskTime={timeOfExternalTaskTime}
            selectedTime={selectedTime}
          />
        }
        content={children}
        footer={<Footer onClose={onClose} onApply={onApply} />}
      />
    </Wrapper>
  );
};

export default DialogFrame;
