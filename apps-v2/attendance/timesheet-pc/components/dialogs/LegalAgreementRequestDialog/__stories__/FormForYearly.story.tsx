import React from 'react';

import { action } from '@storybook/addon-actions';

import { WORK_SYSTEM } from '@attendance/domain/models/LegalAgreementOvertime';
import { STATUS } from '@attendance/domain/models/LegalAgreementRequest';
import { CODE } from '@attendance/domain/models/LegalAgreementRequestType';

import FormForYearly from '../FormForYearly';

export default {
  title:
    'attendance/timesheet-pc/dialogs/LegalAgreementRequestDialog/FormForYearly',
};

export const Default = () => (
  <FormForYearly
    isReadOnly={false}
    overtime={{
      yearlyOvertimeHours: 300,
      yearlyOvertimeHours1YearAgo: 300,
      yearlyOvertimeLimit: 330,
      specialExtensionCountLimit: 500,
      extensionCount: 6,
      specialYearlyOvertimeLimit: 500,
      specialYearlyOvertimeHours: 450,
      specialYearlyOvertimeHours1YearAgo: 500,
    }}
    workSystem={WORK_SYSTEM.MODIFIED_YEARLY}
    targetRequest={{
      id: '',
      requestType: CODE.YEARLY,
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
  <FormForYearly
    isReadOnly={true}
    overtime={{
      yearlyOvertimeHours: 300,
      yearlyOvertimeHours1YearAgo: 300,
      yearlyOvertimeLimit: 330,
      specialExtensionCountLimit: 500,
      extensionCount: 6,
      specialYearlyOvertimeLimit: 500,
      specialYearlyOvertimeHours: 450,
      specialYearlyOvertimeHours1YearAgo: 500,
    }}
    workSystem={WORK_SYSTEM.MODIFIED_YEARLY}
    targetRequest={{
      id: '',
      requestType: CODE.YEARLY,
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
  <FormForYearly
    isReadOnly={true}
    overtime={{
      yearlyOvertimeHours: 300,
      yearlyOvertimeHours1YearAgo: 300,
      yearlyOvertimeLimit: 330,
      specialExtensionCountLimit: 500,
      extensionCount: 6,
      specialYearlyOvertimeLimit: 500,
      specialYearlyOvertimeHours: 450,
      specialYearlyOvertimeHours1YearAgo: 500,
    }}
    workSystem={WORK_SYSTEM.MANAGER}
    targetRequest={{
      id: '',
      requestType: CODE.YEARLY,
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
