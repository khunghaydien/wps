import React from 'react';

import { action } from '@storybook/addon-actions';

import FormForEarlyLeave from '../FormForEarlyLeave';
import {
  AdvanceRequest,
  AfterRequest,
  EarlyLeaveAndUseEarlyLeaveReasonRequest,
  EarlyLeaveReasonList,
  selectedEarlyLeaveReason,
} from './mock-data/earlyRequests';

export default {
  title:
    'attendance/timesheet-pc/dialogs/DailyAttRequestDialog/FormForEarlyLeave',
};

export const PreRequest = () => {
  return (
    <FormForEarlyLeave
      isReadOnly={false}
      isLeavingOffice
      targetRequest={AdvanceRequest}
      onUpdateValue={action('Updated')}
      isFlexWithoutCoreNoWorkingTime={false}
      isFlexWithoutCore={false}
      personalReasonEarlyLeaveEndTime={480}
      objectiveReasonEarlyLeaveEndTime={480}
      earlyLeaveReasonList={[]}
      selectedEarlyLeaveReason={null}
    />
  );
};

export const PostRequest = () => {
  return (
    <FormForEarlyLeave
      isReadOnly={false}
      isLeavingOffice={false}
      targetRequest={AfterRequest}
      onUpdateValue={action('Updated')}
      isFlexWithoutCoreNoWorkingTime={false}
      isFlexWithoutCore={false}
      personalReasonEarlyLeaveEndTime={480}
      objectiveReasonEarlyLeaveEndTime={480}
      earlyLeaveReasonList={[]}
      selectedEarlyLeaveReason={null}
    />
  );
};

export const ReadOnly = () => {
  return (
    <FormForEarlyLeave
      isReadOnly
      isLeavingOffice={false}
      targetRequest={AdvanceRequest}
      onUpdateValue={action('Updated')}
      isFlexWithoutCoreNoWorkingTime={false}
      isFlexWithoutCore={false}
      personalReasonEarlyLeaveEndTime={480}
      objectiveReasonEarlyLeaveEndTime={480}
      earlyLeaveReasonList={[]}
      selectedEarlyLeaveReason={null}
    />
  );
};

export const FlexWithOutCoreNoWorkingTimeRequest = () => {
  return (
    <FormForEarlyLeave
      isReadOnly={false}
      isLeavingOffice={false}
      targetRequest={AfterRequest}
      onUpdateValue={action('Updated')}
      isFlexWithoutCoreNoWorkingTime={true}
      isFlexWithoutCore={false}
      personalReasonEarlyLeaveEndTime={480}
      objectiveReasonEarlyLeaveEndTime={480}
      earlyLeaveReasonList={[]}
      selectedEarlyLeaveReason={null}
    />
  );
};

export const EarlyLeaveRequestForUseEarlyLeaveReason = () => {
  return (
    <FormForEarlyLeave
      isReadOnly={false}
      isLeavingOffice
      targetRequest={EarlyLeaveAndUseEarlyLeaveReasonRequest}
      onUpdateValue={action('Updated')}
      isFlexWithoutCoreNoWorkingTime={false}
      isFlexWithoutCore={false}
      personalReasonEarlyLeaveEndTime={480}
      objectiveReasonEarlyLeaveEndTime={480}
      earlyLeaveReasonList={EarlyLeaveReasonList}
      selectedEarlyLeaveReason={selectedEarlyLeaveReason}
    />
  );
};
