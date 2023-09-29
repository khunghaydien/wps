import { WORK_SYSTEM } from '@attendance/domain/models/LegalAgreementOvertime';
import { EDIT_ACTION } from '@attendance/domain/models/LegalAgreementRequest';
import { CODE } from '@attendance/domain/models/LegalAgreementRequestType';

import list from './list';
import request from './request';

export default {
  editing: {
    id: '',
    requestType: CODE.MONTHLY,
    isEditing: true,
    editAction: EDIT_ACTION.CREATE,
    disableAction: 'None',
  },
  requests: {
    monthlyRequest: {
      overtime: {
        monthlyOvertimeHours: 30,
        monthlyOvertimeHours1MoAgo: 30,
        monthlyOvertimeHours2MoAgo: 30,
        monthlyOvertimeLimit: 60,
        specialExtensionCountLimit: 60,
        extensionCount: 6,
        specialMonthlyOvertimeLimit: 60,
        specialMonthlyOvertimeHours: 60,
        specialMonthlyOvertimeHours1MoAgo: 60,
        specialMonthlyOvertimeHours2MoAgo: 60,
      },
      workSystem: WORK_SYSTEM.MODIFIED_YEARLY,
      request,
    },
    yearlyRequest: {
      overtime: {
        yearlyOvertimeHours: 120,
        yearlyOvertimeHours1YearAgo: 120,
        yearlyOvertimeLimit: 60,
        specialExtensionCountLimit: 60,
        extensionCount: 6,
        specialYearlyOvertimeLimit: 60,
        specialYearlyOvertimeHours: 60,
        specialYearlyOvertimeHours1YearAgo: 60,
      },
      workSystem: WORK_SYSTEM.MODIFIED_YEARLY,
    },
  },
  page: {
    isOpen: true,
  },
  list,
};
