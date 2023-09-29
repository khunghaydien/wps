import React from 'react';

import { action } from '@storybook/addon-actions';

import AccessControlContainer from '@apps/commons/containers/AccessControlContainer';

import {
  DISABLE_ACTION,
  EDIT_ACTION,
} from '@attendance/domain/models/LegalAgreementRequest';

import mockStore from '../../../__stories__/mock-data/storeMock';
import { withProvider } from '../../../../../../../.storybook/decorator/Provider';
import configureStore from '../../../../store/configureStore';
import FormFrame from '../FormFrame';
import FormRow from '../FormRow';

// @ts-ignore
const store = configureStore(mockStore);

export default {
  title:
    'attendance/timesheet-pc/dialogs/LegalAgreementRequestDialog/FormFrame',
  decorators: [withProvider(store)],
};

const FormFrameChildren: React.FC = () => (
  <React.Fragment>
    <FormRow labelText="テキスト">FormFrame Child</FormRow>
    <FormRow labelText="テキスト2">FormFrame Child2</FormRow>
    <FormRow labelText="テキスト3">FormFrame Child3</FormRow>
    <FormRow labelText="テキスト4">FormFrame Child4</FormRow>
    <FormRow labelText="テキスト5">FormFrame Child5</FormRow>
  </React.Fragment>
);

export const NotRequested = () => (
  <FormFrame
    isLoading={false}
    isEditing={true}
    editAction={EDIT_ACTION.CREATE}
    disableAction={DISABLE_ACTION.NONE}
    isAvailableToModify={true}
    approverEmployee={{
      id: '',
      employeeName: '',
    }}
    onSubmit={action('onSubmit()')}
    onDisable={action('onDisable()')}
    onStartEditing={action('onStartEditing()')}
    onCancelEditing={action('onCancelEditing()')}
    onClickOpenApprovalHistoryDialog={action(
      'onClickOpenApprovalHistoryDialog()'
    )}
    onClickOpenApproverEmployeeSettingDialog={action(
      'onClickOpenApproverEmployeeSettingDialog()'
    )}
    AccessControlContainer={AccessControlContainer}
  >
    <FormFrameChildren />
  </FormFrame>
);

export const RejectedOrRemoved = () => (
  <FormFrame
    isLoading={false}
    isEditing={false}
    editAction={EDIT_ACTION.MODIFY}
    disableAction={DISABLE_ACTION.REMOVE}
    isAvailableToModify={true}
    approverEmployee={{
      id: '',
      employeeName: '',
    }}
    onSubmit={action('onSubmit()')}
    onDisable={action('onDisable()')}
    onStartEditing={action('onStartEditing()')}
    onCancelEditing={action('onCancelEditing()')}
    onClickOpenApprovalHistoryDialog={action(
      'onClickOpenApprovalHistoryDialog()'
    )}
    onClickOpenApproverEmployeeSettingDialog={action(
      'onClickOpenApproverEmployeeSettingDialog()'
    )}
    AccessControlContainer={AccessControlContainer}
  >
    <FormFrameChildren />
  </FormFrame>
);

export const RejectedOrRemovedEditing = () => (
  <FormFrame
    isLoading={false}
    isEditing={true}
    editAction={EDIT_ACTION.MODIFY}
    disableAction={DISABLE_ACTION.REMOVE}
    isAvailableToModify={true}
    approverEmployee={{
      id: '',
      employeeName: '',
    }}
    onSubmit={action('onSubmit()')}
    onDisable={action('onDisable()')}
    onStartEditing={action('onStartEditing()')}
    onCancelEditing={action('onCancelEditing()')}
    onClickOpenApprovalHistoryDialog={action(
      'onClickOpenApprovalHistoryDialog()'
    )}
    onClickOpenApproverEmployeeSettingDialog={action(
      'onClickOpenApproverEmployeeSettingDialog()'
    )}
    AccessControlContainer={AccessControlContainer}
  >
    <FormFrameChildren />
  </FormFrame>
);

export const Approved = () => (
  <FormFrame
    isLoading={false}
    isEditing={false}
    editAction={EDIT_ACTION.REAPPLY}
    disableAction={DISABLE_ACTION.CANCEL_APPROVAL}
    isAvailableToModify={true}
    approverEmployee={{
      id: '',
      employeeName: '',
    }}
    onSubmit={action('onSubmit()')}
    onDisable={action('onDisable()')}
    onStartEditing={action('onStartEditing()')}
    onCancelEditing={action('onCancelEditing()')}
    onClickOpenApprovalHistoryDialog={action(
      'onClickOpenApprovalHistoryDialog()'
    )}
    onClickOpenApproverEmployeeSettingDialog={action(
      'onClickOpenApproverEmployeeSettingDialog()'
    )}
    AccessControlContainer={AccessControlContainer}
  >
    <FormFrameChildren />
  </FormFrame>
);

export const ApprovedEditing = () => (
  <FormFrame
    isLoading={false}
    isEditing={true}
    editAction={EDIT_ACTION.REAPPLY}
    disableAction={DISABLE_ACTION.CANCEL_APPROVAL}
    isAvailableToModify={true}
    approverEmployee={{
      id: '',
      employeeName: '',
    }}
    onSubmit={action('onSubmit()')}
    onDisable={action('onDisable()')}
    onStartEditing={action('onStartEditing()')}
    onCancelEditing={action('onCancelEditing()')}
    onClickOpenApprovalHistoryDialog={action(
      'onClickOpenApprovalHistoryDialog()'
    )}
    onClickOpenApproverEmployeeSettingDialog={action(
      'onClickOpenApproverEmployeeSettingDialog()'
    )}
    AccessControlContainer={AccessControlContainer}
  >
    <FormFrameChildren />
  </FormFrame>
);
