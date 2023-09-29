import React from 'react';
import { shallowEqual, useSelector } from 'react-redux';

import DialogFrame from '../../components/DialogFrame';

type Props = {
  empId: string;
  targetDate: string;
  timeOfAttendance: number | null | undefined;
  timeOfExternalTaskTime: number | null;
  children: React.ReactNode;
  onClose: () => void;
  onApply: () => void;
};

const mapStateToProps = (state) => {
  return {
    selectedTime: state.ui.allocateResult.selectedTime,
  };
};

const DialogFrameContainer: React.FC<Props> = ({
  empId,
  targetDate,
  timeOfAttendance,
  timeOfExternalTaskTime,
  children,
  onClose,
  onApply,
}) => {
  const { selectedTime } = useSelector(mapStateToProps, shallowEqual);
  return (
    <DialogFrame
      empId={empId}
      targetDate={targetDate}
      timeOfAttendance={timeOfAttendance}
      timeOfExternalTaskTime={timeOfExternalTaskTime}
      selectedTime={selectedTime}
      onClose={onClose}
      onApply={onApply}
    >
      {children}
    </DialogFrame>
  );
};

export default DialogFrameContainer;
