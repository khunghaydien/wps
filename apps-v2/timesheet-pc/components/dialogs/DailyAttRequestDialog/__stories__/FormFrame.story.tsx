import React from 'react';

import { action } from '@storybook/addon-actions';

import {
  DISABLE_ACTION,
  EDIT_ACTION,
} from '../../../../../domain/models/attendance/AttDailyRequest';

import mockStore from '../../../__stories__/mock-data/storeMock';
import { withProvider } from '../../../../../../.storybook/decorator/Provider';
import configureStore from '../../../../store/configureStore';
import FormFrame from '../FormFrame';
import FormRow from '../FormRow';

// @ts-ignore
const store = configureStore(mockStore);

const approverEmployee = {
  id: '',
  employeeName: '',
};

const FormFrameChildren = () => (
  <>
    <FormRow labelText="テキスト">FormFrame Child</FormRow>
    <FormRow labelText="テキスト2">FormFrame Child2</FormRow>
    <FormRow labelText="テキスト3">FormFrame Child3</FormRow>
    <FormRow labelText="テキスト4">FormFrame Child4</FormRow>
    <FormRow labelText="テキスト5">FormFrame Child5</FormRow>
  </>
);

export default {
  title: 'timesheet-pc/dialogs/DailyAttRequestDialog/FormFrame',
  decorators: [withProvider(store)],
};

export const NotRequested = () => {
  return (
    <FormFrame
      isLoading={false}
      isAvailableToModify
      isEditing
      editAction={EDIT_ACTION.Create}
      disableAction={DISABLE_ACTION.None}
      approverEmployee={approverEmployee}
      onSubmit={action('onSubmit')}
      onDisable={action('onDisable')}
      onStartEditing={action('onStartEditing')}
      onCancelEditing={action('onCancelEditing')}
      onClickOpenApprovalHistoryDialog={action(
        'onClickOpenApprovalHistoryDialog'
      )}
      onClickOpenApproverEmployeeSettingDialog={action(
        'onClickOpenApproverEmployeeSettingDialog'
      )}
    >
      <FormFrameChildren />
    </FormFrame>
  );
};

NotRequested.storyName = 'NotRequested';

export const NotRequestedLoading = () => {
  return (
    <FormFrame
      isLoading
      isAvailableToModify
      isEditing
      editAction={EDIT_ACTION.Create}
      disableAction={DISABLE_ACTION.None}
      approverEmployee={approverEmployee}
      onSubmit={action('onSubmit')}
      onDisable={action('onDisable')}
      onStartEditing={action('onStartEditing')}
      onCancelEditing={action('onCancelEditing')}
      onClickOpenApprovalHistoryDialog={action(
        'onClickOpenApprovalHistoryDialog'
      )}
      onClickOpenApproverEmployeeSettingDialog={action(
        'onClickOpenApproverEmployeeSettingDialog'
      )}
    >
      <FormFrameChildren />
    </FormFrame>
  );
};

NotRequestedLoading.storyName = 'NotRequested [Loading]';

export const PendingApprovalIn = () => {
  return (
    <FormFrame
      isLoading={false}
      isAvailableToModify
      isEditing={false}
      editAction={EDIT_ACTION.None}
      disableAction={DISABLE_ACTION.CancelRequest}
      approverEmployee={approverEmployee}
      onSubmit={action('onSubmit')}
      onDisable={action('onDisable')}
      onStartEditing={action('onStartEditing')}
      onCancelEditing={action('onCancelEditing')}
      onClickOpenApprovalHistoryDialog={action(
        'onClickOpenApprovalHistoryDialog'
      )}
      onClickOpenApproverEmployeeSettingDialog={action(
        'onClickOpenApproverEmployeeSettingDialog'
      )}
    >
      <FormFrameChildren />
    </FormFrame>
  );
};

PendingApprovalIn.storyName = 'Pending & Approval In';

export const PendingApprovalInLoading = () => {
  return (
    <FormFrame
      isLoading
      isAvailableToModify
      isEditing={false}
      editAction={EDIT_ACTION.None}
      disableAction={DISABLE_ACTION.CancelRequest}
      approverEmployee={approverEmployee}
      onSubmit={action('onSubmit')}
      onDisable={action('onDisable')}
      onStartEditing={action('onStartEditing')}
      onCancelEditing={action('onCancelEditing')}
      onClickOpenApprovalHistoryDialog={action(
        'onClickOpenApprovalHistoryDialog'
      )}
      onClickOpenApproverEmployeeSettingDialog={action(
        'onClickOpenApproverEmployeeSettingDialog'
      )}
    >
      <FormFrameChildren />
    </FormFrame>
  );
};

PendingApprovalInLoading.storyName = 'Pending & Approval In [Loading]';

export const RemovedRejected = () => {
  return (
    <FormFrame
      isLoading={false}
      isAvailableToModify
      isEditing={false}
      editAction={EDIT_ACTION.Modify}
      disableAction={DISABLE_ACTION.Remove}
      approverEmployee={approverEmployee}
      onSubmit={action('onSubmit')}
      onDisable={action('onDisable')}
      onStartEditing={action('onStartEditing')}
      onCancelEditing={action('onCancelEditing')}
      onClickOpenApprovalHistoryDialog={action(
        'onClickOpenApprovalHistoryDialog'
      )}
      onClickOpenApproverEmployeeSettingDialog={action(
        'onClickOpenApproverEmployeeSettingDialog'
      )}
    >
      <FormFrameChildren />
    </FormFrame>
  );
};

RemovedRejected.storyName = 'Removed & Rejected';

export const RemovedRejectedLoading = () => {
  return (
    <FormFrame
      isLoading
      isAvailableToModify
      isEditing={false}
      editAction={EDIT_ACTION.Modify}
      disableAction={DISABLE_ACTION.Remove}
      approverEmployee={approverEmployee}
      onSubmit={action('onSubmit')}
      onDisable={action('onDisable')}
      onStartEditing={action('onStartEditing')}
      onCancelEditing={action('onCancelEditing')}
      onClickOpenApprovalHistoryDialog={action(
        'onClickOpenApprovalHistoryDialog'
      )}
      onClickOpenApproverEmployeeSettingDialog={action(
        'onClickOpenApproverEmployeeSettingDialog'
      )}
    >
      <FormFrameChildren />
    </FormFrame>
  );
};

RemovedRejectedLoading.storyName = 'Removed & Rejected [Loading]';

export const RemovedRejectedEditing = () => {
  return (
    <FormFrame
      isLoading={false}
      isAvailableToModify
      isEditing
      editAction={EDIT_ACTION.Modify}
      disableAction={DISABLE_ACTION.Remove}
      approverEmployee={approverEmployee}
      onSubmit={action('onSubmit')}
      onDisable={action('onDisable')}
      onStartEditing={action('onStartEditing')}
      onCancelEditing={action('onCancelEditing')}
      onClickOpenApprovalHistoryDialog={action(
        'onClickOpenApprovalHistoryDialog'
      )}
      onClickOpenApproverEmployeeSettingDialog={action(
        'onClickOpenApproverEmployeeSettingDialog'
      )}
    >
      <FormFrameChildren />
    </FormFrame>
  );
};

RemovedRejectedEditing.storyName = 'Removed & Rejected [Editing]';

export const Approved = () => {
  return (
    <FormFrame
      isLoading={false}
      isAvailableToModify
      isEditing={false}
      editAction={EDIT_ACTION.None}
      disableAction={DISABLE_ACTION.CancelApproval}
      approverEmployee={approverEmployee}
      onSubmit={action('onSubmit')}
      onDisable={action('onDisable')}
      onStartEditing={action('onStartEditing')}
      onCancelEditing={action('onCancelEditing')}
      onClickOpenApprovalHistoryDialog={action(
        'onClickOpenApprovalHistoryDialog'
      )}
      onClickOpenApproverEmployeeSettingDialog={action(
        'onClickOpenApproverEmployeeSettingDialog'
      )}
    >
      <FormFrameChildren />
    </FormFrame>
  );
};

export const ApprovedEditing = () => {
  return (
    <FormFrame
      isLoading={false}
      isAvailableToModify
      isEditing
      editAction={EDIT_ACTION.Reapply}
      disableAction={DISABLE_ACTION.CancelApproval}
      approverEmployee={approverEmployee}
      onSubmit={action('onSubmit')}
      onDisable={action('onDisable')}
      onStartEditing={action('onStartEditing')}
      onCancelEditing={action('onCancelEditing')}
      onClickOpenApprovalHistoryDialog={action(
        'onClickOpenApprovalHistoryDialog'
      )}
      onClickOpenApproverEmployeeSettingDialog={action(
        'onClickOpenApproverEmployeeSettingDialog'
      )}
    >
      <FormFrameChildren />
    </FormFrame>
  );
};

ApprovedEditing.storyName = 'Approved [Editing]';

export const TimesheetIsLocked = () => {
  return (
    <FormFrame
      isLoading={false}
      isAvailableToModify={false}
      isEditing={false}
      editAction={EDIT_ACTION.None}
      disableAction={DISABLE_ACTION.None}
      approverEmployee={approverEmployee}
      onSubmit={action('onSubmit')}
      onDisable={action('onDisable')}
      onStartEditing={action('onStartEditing')}
      onCancelEditing={action('onCancelEditing')}
      onClickOpenApprovalHistoryDialog={action(
        'onClickOpenApprovalHistoryDialog'
      )}
      onClickOpenApproverEmployeeSettingDialog={action(
        'onClickOpenApproverEmployeeSettingDialog'
      )}
    >
      <FormFrameChildren />
    </FormFrame>
  );
};

TimesheetIsLocked.storyName = 'Timesheet is Locked';
