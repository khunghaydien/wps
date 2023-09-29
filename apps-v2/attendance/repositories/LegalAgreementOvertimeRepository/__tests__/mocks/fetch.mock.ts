import { WORK_SYSTEM } from '@attendance/domain/models/LegalAgreementOvertime';

import { Response } from '../../fetch';

export const defaultValue: Response = {
  legalAgreement: {
    monthlyOvertimeLimit: 100,
    specialMonthlyOvertimeLimit: 200,
    yearlyOvertimeLimit: 200,
    specialYearlyOvertimeLimit: 100,
    specialExtensionCountLimit: 100,
  },
  overtimeHours: {
    monthlyOvertimeHours: 20,
    monthlyOvertimeHours1MoAgo: 30,
    monthlyOvertimeHours2MoAgo: 20,
    specialMonthlyOvertimeHours: 30,
    specialMonthlyOvertimeHours1MoAgo: 30,
    specialMonthlyOvertimeHours2MoAgo: 40,
    yearlyOvertimeHours: 200,
    yearlyOvertimeHours1YearAgo: 200,
    specialYearlyOvertimeHours: 300,
    specialYearlyOvertimeHours1YearAgo: 300,
    extensionCount: 3,
  },
  legalAgreementWorkSystem: WORK_SYSTEM.MODIFIED_YEARLY,
};
