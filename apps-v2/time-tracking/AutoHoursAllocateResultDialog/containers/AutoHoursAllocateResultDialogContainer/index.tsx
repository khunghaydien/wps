import React, { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { AutoHoursAllocationDictSurplusTime } from '@apps/domain/models/time-tracking/AutoHoursAllocationDict';
import { AutoHoursAllocationResult } from '@apps/domain/models/time-tracking/AutoHoursAllocationResult';

import { State } from '../../modules';

import AllocateResultService from '../../action-dispatchers/AllocateResult';

import BlockScreen from './BlockScreenContainer';
import ConfirmDialogContainer from './ConfirmDialogContainer';
import ContentContainer from './ContentContainer';
import DialogFrameContainer from './DialogFrameContainer';
import Notification from './NotificationContainer';
import SpinnerContainer from './SpinnerContainer';

type Props = {
  empId: string | undefined;
  targetDate: string;
  timeOfAttendance: number | null | undefined;
  timeOfExternalTaskTime: number | null;
  onClose: () => void;
  onApply: (
    arg0: AutoHoursAllocationResult[],
    arg1: AutoHoursAllocationDictSurplusTime
  ) => void;
};

const AutoHoursAllocateResultDialogContainer: React.FC<Props> = ({
  empId,
  targetDate,
  timeOfAttendance,
  timeOfExternalTaskTime,
  onClose,
  onApply: injectedOnApply,
}) => {
  const allocateResult = useSelector(
    (state: State) => state.ui.allocateResult.editing
  );
  const dispatch = useDispatch();

  const onApply = useMemo(() => {
    const allocateResultService = AllocateResultService(dispatch);
    return () =>
      allocateResultService.apply({
        empId,
        targetDate,
        results: allocateResult,
        onApply: injectedOnApply,
        onClose,
      });
  }, [dispatch, empId, targetDate, allocateResult, injectedOnApply, onClose]);

  return (
    <>
      <DialogFrameContainer
        empId={empId}
        targetDate={targetDate}
        timeOfAttendance={timeOfAttendance}
        timeOfExternalTaskTime={timeOfExternalTaskTime}
        onClose={onClose}
        onApply={onApply}
      >
        <ContentContainer empId={empId} targetDate={targetDate} />
      </DialogFrameContainer>
      <ConfirmDialogContainer />
      <BlockScreen />
      <Notification />
      <SpinnerContainer />
    </>
  );
};

export default AutoHoursAllocateResultDialogContainer;
