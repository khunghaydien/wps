import React from 'react';

import { action } from '@storybook/addon-actions';

import AccessControlContainer from '@apps/commons/containers/AccessControlContainer';

import {
  DISABLE_ACTION,
  EDIT_ACTION,
  STATUS,
} from '@attendance/domain/models/LegalAgreementRequest';
import { CODE } from '@attendance/domain/models/LegalAgreementRequestType';

import FormForMonthly from '@apps/attendance/timesheet-pc/components/dialogs/LegalAgreementRequestDialog/FormForMonthly';
import FormForYearly from '@apps/attendance/timesheet-pc/components/dialogs/LegalAgreementRequestDialog/FormForYearly';

import LegalAgreementRequestDialog from '../index';

const FormForMonthlyContainer = () => (
  <FormForMonthly
    isReadOnly={false}
    overtime={null}
    workSystem={null}
    targetRequest={null}
    requireFlags={null}
    onUpdateValue={action('FromForMonthlyContainer.onUpdateValue()')}
  />
);

const FormForYearlyContainer = () => (
  <FormForYearly
    isReadOnly={false}
    overtime={null}
    workSystem={null}
    targetRequest={null}
    requireFlags={null}
    onUpdateValue={action('FormForYearlyContainer.onUpdateValue()')}
  />
);

export default {
  title: 'attendance/timesheet-pc/dialogs/LegalAgreementRequestDialog',
};

export const New = () => {
  return (
    <LegalAgreementRequestDialog
      pageLoading={false}
      editing={{
        id: '',
        requestType: CODE.MONTHLY,
        editAction: EDIT_ACTION.CREATE,
        disableAction: DISABLE_ACTION.NONE,
        isEditing: false,
      }}
      requestConditions={{
        isLocked: false,
        availableRequestTypes: { [CODE.MONTHLY]: CODE.MONTHLY },
        latestRequests: [],
      }}
      targetRequest={undefined}
      globalLoading={false}
      approverEmployee={{
        id: '',
        employeeName: '',
      }}
      onClickRequestDetailButton={action('onClickRequestDetailButton()')}
      onClickRequestEntryButton={action('onClickRequestEntryButton()')}
      onClose={action('onClose()')}
      onStartEditing={action('onStartEditing()')}
      onCancelEditing={action('onCancelEditing()')}
      onSubmitRequest={action('onSubmitRequest()')}
      onDisableRequest={action('onDisableRequest()')}
      onClickOpenApprovalHistoryDialog={action(
        'onClickOpenApprovalHistoryDialog()'
      )}
      onClickOpenApproverEmployeeSettingDialog={action(
        'onClickOpenApproverEmployeeSettingDialog()'
      )}
      currentMonth={'2022/9'}
      FormForMonthlyContainer={FormForMonthlyContainer}
      FormForYearlyContainer={FormForYearlyContainer}
      AccessControlContainer={AccessControlContainer}
    />
  );
};

export const ApprovelIn = () => {
  return (
    <LegalAgreementRequestDialog
      pageLoading={false}
      editing={{
        id: '',
        requestType: CODE.MONTHLY,
        editAction: EDIT_ACTION.CREATE,
        disableAction: DISABLE_ACTION.NONE,
        isEditing: false,
      }}
      requestConditions={{
        isLocked: false,
        availableRequestTypes: {},
        latestRequests: [
          {
            approver01Name: 'approver01',
            changedOvertimeHoursLimit: 60,
            id: '111222',
            measure: 'measure',
            reason: 'reason',
            requestType: CODE.MONTHLY,
            status: STATUS.APPROVAL_IN,
            originalRequestId: 'diew324',
            isForReapply: false,
          },
        ],
      }}
      targetRequest={undefined}
      globalLoading={false}
      approverEmployee={{
        id: '',
        employeeName: '',
      }}
      onClickRequestDetailButton={action('onClickRequestDetailButton()')}
      onClickRequestEntryButton={action('onClickRequestEntryButton()')}
      onClose={action('onClose()')}
      onStartEditing={action('onStartEditing()')}
      onCancelEditing={action('onCancelEditing()')}
      onSubmitRequest={action('onSubmitRequest()')}
      onDisableRequest={action('onDisableRequest()')}
      onClickOpenApprovalHistoryDialog={action(
        'onClickOpenApprovalHistoryDialog()'
      )}
      onClickOpenApproverEmployeeSettingDialog={action(
        'onClickOpenApproverEmployeeSettingDialog()'
      )}
      currentMonth={''}
      FormForMonthlyContainer={FormForMonthlyContainer}
      FormForYearlyContainer={FormForYearlyContainer}
      AccessControlContainer={AccessControlContainer}
    />
  );
};

export const Approved = () => {
  return (
    <LegalAgreementRequestDialog
      pageLoading={false}
      editing={{
        id: '',
        requestType: CODE.MONTHLY,
        editAction: EDIT_ACTION.CREATE,
        disableAction: DISABLE_ACTION.NONE,
        isEditing: false,
      }}
      requestConditions={{
        isLocked: false,
        availableRequestTypes: {},
        latestRequests: [
          {
            approver01Name: 'approver01',
            changedOvertimeHoursLimit: 60,
            id: '111222',
            measure: 'measure',
            reason: 'reason',
            requestType: CODE.MONTHLY,
            status: STATUS.APPROVED,
            originalRequestId: 'diew324',
            isForReapply: false,
          },
        ],
      }}
      targetRequest={undefined}
      globalLoading={false}
      approverEmployee={{
        id: '',
        employeeName: '',
      }}
      onClickRequestDetailButton={action('onClickRequestDetailButton()')}
      onClickRequestEntryButton={action('onClickRequestEntryButton()')}
      onClose={action('onClose()')}
      onStartEditing={action('onStartEditing()')}
      onCancelEditing={action('onCancelEditing()')}
      onSubmitRequest={action('onSubmitRequest()')}
      onDisableRequest={action('onDisableRequest()')}
      onClickOpenApprovalHistoryDialog={action(
        'onClickOpenApprovalHistoryDialog()'
      )}
      onClickOpenApproverEmployeeSettingDialog={action(
        'onClickOpenApproverEmployeeSettingDialog()'
      )}
      currentMonth={''}
      FormForMonthlyContainer={FormForMonthlyContainer}
      FormForYearlyContainer={FormForYearlyContainer}
      AccessControlContainer={AccessControlContainer}
    />
  );
};

export const Rejected = () => {
  return (
    <LegalAgreementRequestDialog
      pageLoading={false}
      editing={{
        id: '',
        requestType: CODE.MONTHLY,
        editAction: EDIT_ACTION.CREATE,
        disableAction: DISABLE_ACTION.NONE,
        isEditing: false,
      }}
      requestConditions={{
        isLocked: false,
        availableRequestTypes: {},
        latestRequests: [
          {
            approver01Name: 'approver01',
            changedOvertimeHoursLimit: 60,
            id: '111222',
            measure: 'measure',
            reason: 'reason',
            requestType: CODE.MONTHLY,
            status: STATUS.REJECTED,
            originalRequestId: 'diew324',
            isForReapply: false,
          },
        ],
      }}
      targetRequest={undefined}
      globalLoading={false}
      approverEmployee={{
        id: '',
        employeeName: '',
      }}
      onClickRequestDetailButton={action('onClickRequestDetailButton()')}
      onClickRequestEntryButton={action('onClickRequestEntryButton()')}
      onClose={action('onClose()')}
      onStartEditing={action('onStartEditing()')}
      onCancelEditing={action('onCancelEditing()')}
      onSubmitRequest={action('onSubmitRequest()')}
      onDisableRequest={action('onDisableRequest()')}
      onClickOpenApprovalHistoryDialog={action(
        'onClickOpenApprovalHistoryDialog()'
      )}
      onClickOpenApproverEmployeeSettingDialog={action(
        'onClickOpenApproverEmployeeSettingDialog()'
      )}
      currentMonth={''}
      FormForMonthlyContainer={FormForMonthlyContainer}
      FormForYearlyContainer={FormForYearlyContainer}
      AccessControlContainer={AccessControlContainer}
    />
  );
};

export const Canceled = () => {
  return (
    <LegalAgreementRequestDialog
      pageLoading={false}
      editing={{
        id: '',
        requestType: CODE.MONTHLY,
        editAction: EDIT_ACTION.CREATE,
        disableAction: DISABLE_ACTION.NONE,
        isEditing: false,
      }}
      requestConditions={{
        isLocked: false,
        availableRequestTypes: {},
        latestRequests: [
          {
            approver01Name: 'approver01',
            changedOvertimeHoursLimit: 60,
            id: '111222',
            measure: 'measure',
            reason: 'reason',
            requestType: CODE.MONTHLY,
            status: STATUS.CANCELED,
            originalRequestId: 'diew324',
            isForReapply: false,
          },
        ],
      }}
      targetRequest={undefined}
      globalLoading={false}
      approverEmployee={{
        id: '',
        employeeName: '',
      }}
      onClickRequestDetailButton={action('onClickRequestDetailButton()')}
      onClickRequestEntryButton={action('onClickRequestEntryButton()')}
      onClose={action('onClose()')}
      onStartEditing={action('onStartEditing()')}
      onCancelEditing={action('onCancelEditing()')}
      onSubmitRequest={action('onSubmitRequest()')}
      onDisableRequest={action('onDisableRequest()')}
      onClickOpenApprovalHistoryDialog={action(
        'onClickOpenApprovalHistoryDialog()'
      )}
      onClickOpenApproverEmployeeSettingDialog={action(
        'onClickOpenApproverEmployeeSettingDialog()'
      )}
      currentMonth={''}
      FormForMonthlyContainer={FormForMonthlyContainer}
      FormForYearlyContainer={FormForYearlyContainer}
      AccessControlContainer={AccessControlContainer}
    />
  );
};

export const ReapplyApprovedIn = () => {
  return (
    <LegalAgreementRequestDialog
      pageLoading={false}
      editing={{
        id: '',
        requestType: CODE.MONTHLY,
        editAction: EDIT_ACTION.CREATE,
        disableAction: DISABLE_ACTION.NONE,
        isEditing: false,
      }}
      requestConditions={{
        isLocked: false,
        availableRequestTypes: { [CODE.YEARLY]: CODE.YEARLY },
        latestRequests: [
          {
            approver01Name: 'approver01',
            changedOvertimeHoursLimit: 60,
            id: '111222',
            measure: 'measure',
            reason: 'reason',
            requestType: CODE.MONTHLY,
            status: STATUS.APPROVAL_IN,
            originalRequestId: 'diew324',
            isForReapply: true,
          },
        ],
      }}
      targetRequest={undefined}
      globalLoading={false}
      approverEmployee={{
        id: '',
        employeeName: '',
      }}
      onClickRequestDetailButton={action('onClickRequestDetailButton()')}
      onClickRequestEntryButton={action('onClickRequestEntryButton()')}
      onClose={action('onClose()')}
      onStartEditing={action('onStartEditing()')}
      onCancelEditing={action('onCancelEditing()')}
      onSubmitRequest={action('onSubmitRequest()')}
      onDisableRequest={action('onDisableRequest()')}
      onClickOpenApprovalHistoryDialog={action(
        'onClickOpenApprovalHistoryDialog()'
      )}
      onClickOpenApproverEmployeeSettingDialog={action(
        'onClickOpenApproverEmployeeSettingDialog()'
      )}
      currentMonth={''}
      FormForMonthlyContainer={FormForMonthlyContainer}
      FormForYearlyContainer={FormForYearlyContainer}
      AccessControlContainer={AccessControlContainer}
    />
  );
};

export const ReapplyCanceled = () => {
  return (
    <LegalAgreementRequestDialog
      pageLoading={false}
      editing={{
        id: '',
        requestType: CODE.MONTHLY,
        editAction: EDIT_ACTION.CREATE,
        disableAction: DISABLE_ACTION.NONE,
        isEditing: false,
      }}
      requestConditions={{
        isLocked: false,
        availableRequestTypes: { [CODE.YEARLY]: CODE.YEARLY },
        latestRequests: [
          {
            approver01Name: 'approver01',
            changedOvertimeHoursLimit: 60,
            id: '111222',
            measure: 'measure',
            reason: 'reason',
            requestType: CODE.MONTHLY,
            status: STATUS.CANCELED,
            originalRequestId: 'diew324',
            isForReapply: true,
          },
        ],
      }}
      targetRequest={undefined}
      globalLoading={false}
      approverEmployee={{
        id: '',
        employeeName: '',
      }}
      onClickRequestDetailButton={action('onClickRequestDetailButton()')}
      onClickRequestEntryButton={action('onClickRequestEntryButton()')}
      onClose={action('onClose()')}
      onStartEditing={action('onStartEditing()')}
      onCancelEditing={action('onCancelEditing()')}
      onSubmitRequest={action('onSubmitRequest()')}
      onDisableRequest={action('onDisableRequest()')}
      onClickOpenApprovalHistoryDialog={action(
        'onClickOpenApprovalHistoryDialog()'
      )}
      onClickOpenApproverEmployeeSettingDialog={action(
        'onClickOpenApproverEmployeeSettingDialog()'
      )}
      currentMonth={''}
      FormForMonthlyContainer={FormForMonthlyContainer}
      FormForYearlyContainer={FormForYearlyContainer}
      AccessControlContainer={AccessControlContainer}
    />
  );
};

export const ReapplyRejected = () => {
  return (
    <LegalAgreementRequestDialog
      pageLoading={false}
      editing={{
        id: '',
        requestType: CODE.MONTHLY,
        editAction: EDIT_ACTION.CREATE,
        disableAction: DISABLE_ACTION.NONE,
        isEditing: false,
      }}
      requestConditions={{
        isLocked: false,
        availableRequestTypes: { [CODE.YEARLY]: CODE.YEARLY },
        latestRequests: [
          {
            approver01Name: 'approver01',
            changedOvertimeHoursLimit: 60,
            id: '111222',
            measure: 'measure',
            reason: 'reason',
            requestType: CODE.MONTHLY,
            status: STATUS.REJECTED,
            originalRequestId: 'diew324',
            isForReapply: true,
          },
        ],
      }}
      targetRequest={undefined}
      globalLoading={false}
      approverEmployee={{
        id: '',
        employeeName: '',
      }}
      onClickRequestDetailButton={action('onClickRequestDetailButton()')}
      onClickRequestEntryButton={action('onClickRequestEntryButton()')}
      onClose={action('onClose()')}
      onStartEditing={action('onStartEditing()')}
      onCancelEditing={action('onCancelEditing()')}
      onSubmitRequest={action('onSubmitRequest()')}
      onDisableRequest={action('onDisableRequest()')}
      onClickOpenApprovalHistoryDialog={action(
        'onClickOpenApprovalHistoryDialog()'
      )}
      onClickOpenApproverEmployeeSettingDialog={action(
        'onClickOpenApproverEmployeeSettingDialog()'
      )}
      currentMonth={''}
      FormForMonthlyContainer={FormForMonthlyContainer}
      FormForYearlyContainer={FormForYearlyContainer}
      AccessControlContainer={AccessControlContainer}
    />
  );
};

export const Disabled = () => {
  return (
    <LegalAgreementRequestDialog
      pageLoading={true}
      editing={{
        id: '',
        requestType: null,
        editAction: EDIT_ACTION.CREATE,
        disableAction: DISABLE_ACTION.NONE,
        isEditing: false,
      }}
      requestConditions={{
        isLocked: false,
        availableRequestTypes: { [CODE.MONTHLY]: CODE.MONTHLY },
        latestRequests: [
          {
            approver01Name: 'approver01',
            changedOvertimeHoursLimit: 60,
            id: '00001',
            measure: 'measure',
            reason: 'reason',
            requestType: CODE.MONTHLY,
            status: STATUS.APPROVAL_IN,
            originalRequestId: null,
            isForReapply: false,
          },
          {
            approver01Name: 'approver01',
            changedOvertimeHoursLimit: 60,
            id: '00002',
            measure: 'measure',
            reason: 'reason',
            requestType: CODE.YEARLY,
            status: STATUS.APPROVAL_IN,
            originalRequestId: null,
            isForReapply: false,
          },
        ],
      }}
      targetRequest={undefined}
      globalLoading={false}
      approverEmployee={{
        id: '',
        employeeName: '',
      }}
      onClickRequestDetailButton={action('onClickRequestDetailButton()')}
      onClickRequestEntryButton={action('onClickRequestEntryButton()')}
      onClose={action('onClose()')}
      onStartEditing={action('onStartEditing()')}
      onCancelEditing={action('onCancelEditing()')}
      onSubmitRequest={action('onSubmitRequest()')}
      onDisableRequest={action('onDisableRequest()')}
      onClickOpenApprovalHistoryDialog={action(
        'onClickOpenApprovalHistoryDialog()'
      )}
      onClickOpenApproverEmployeeSettingDialog={action(
        'onClickOpenApproverEmployeeSettingDialog()'
      )}
      currentMonth={'2022/9'}
      FormForMonthlyContainer={FormForMonthlyContainer}
      FormForYearlyContainer={FormForYearlyContainer}
      AccessControlContainer={AccessControlContainer}
    />
  );
};
