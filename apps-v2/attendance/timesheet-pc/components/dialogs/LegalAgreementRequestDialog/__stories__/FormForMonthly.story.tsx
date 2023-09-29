import React from 'react';

import { action } from '@storybook/addon-actions';

import { WORK_SYSTEM } from '@attendance/domain/models/LegalAgreementOvertime';
import { STATUS } from '@attendance/domain/models/LegalAgreementRequest';
import { CODE } from '@attendance/domain/models/LegalAgreementRequestType';

import FormForMonthly from '../FormForMonthly';

export default {
  title:
    'attendance/timesheet-pc/dialogs/LegalAgreementRequestDialog/FormForMonthly',
};

export const Default = () => (
  <FormForMonthly
    isReadOnly={false}
    overtime={{
      monthlyOvertimeHours: 43,
      monthlyOvertimeHours1MoAgo: 50,
      monthlyOvertimeHours2MoAgo: 40,
      monthlyOvertimeLimit: 0,
      specialExtensionCountLimit: 6,
      extensionCount: 1,
      specialMonthlyOvertimeLimit: 60,
      specialMonthlyOvertimeHours: 60,
      specialMonthlyOvertimeHours1MoAgo: 60,
      specialMonthlyOvertimeHours2MoAgo: 60,
    }}
    workSystem={WORK_SYSTEM.MODIFIED_YEARLY}
    targetRequest={{
      id: '',
      requestType: CODE.MONTHLY,
      status: STATUS.NOT_REQUESTED,
      approver01Name: '',
      changedOvertimeHoursLimit: 60,
      reason: '',
      measure: '',
      originalRequestId: 'diew324',
      isForReapply: false,
    }}
    onUpdateValue={action('onUpdateValue()')}
    requireFlags={{
      requireReason: true,
      requireMeasures: true,
    }}
  />
);

export const ReadOnly = () => (
  <FormForMonthly
    isReadOnly={true}
    overtime={{
      monthlyOvertimeHours: 43,
      monthlyOvertimeHours1MoAgo: 50,
      monthlyOvertimeHours2MoAgo: 40,
      monthlyOvertimeLimit: 0,
      specialExtensionCountLimit: 6,
      extensionCount: 1,
      specialMonthlyOvertimeLimit: 60,
      specialMonthlyOvertimeHours: 60,
      specialMonthlyOvertimeHours1MoAgo: 60,
      specialMonthlyOvertimeHours2MoAgo: 60,
    }}
    workSystem={WORK_SYSTEM.MODIFIED_YEARLY}
    targetRequest={{
      id: '',
      requestType: CODE.MONTHLY,
      status: STATUS.NOT_REQUESTED,
      approver01Name: '',
      changedOvertimeHoursLimit: 60,
      reason: '',
      measure: '',
      originalRequestId: 'diew324',
      isForReapply: false,
    }}
    onUpdateValue={action('onUpdateValue()')}
    requireFlags={{
      requireReason: false,
      requireMeasures: false,
    }}
  />
);

export const NoSpecial = () => (
  <FormForMonthly
    isReadOnly={true}
    overtime={{
      monthlyOvertimeHours: 43,
      monthlyOvertimeHours1MoAgo: 50,
      monthlyOvertimeHours2MoAgo: 40,
      monthlyOvertimeLimit: 0,
      specialExtensionCountLimit: 6,
      extensionCount: 1,
      specialMonthlyOvertimeLimit: 60,
      specialMonthlyOvertimeHours: 60,
      specialMonthlyOvertimeHours1MoAgo: 60,
      specialMonthlyOvertimeHours2MoAgo: 60,
    }}
    workSystem={WORK_SYSTEM.MANAGER}
    targetRequest={{
      id: '',
      requestType: CODE.MONTHLY,
      status: STATUS.NOT_REQUESTED,
      approver01Name: '',
      changedOvertimeHoursLimit: 60,
      reason: '',
      measure: '',
      originalRequestId: 'diew324',
      isForReapply: false,
    }}
    onUpdateValue={action('onUpdateValue()')}
    requireFlags={{
      requireReason: false,
      requireMeasures: false,
    }}
  />
);
