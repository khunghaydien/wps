import Api from '@apps/commons/api';
import TimeUtil from '@apps/commons/utils/TimeUtil';

import {
  ILegalAgreementOvertimeRepository,
  LegalAgreementOvertime as DomainLegalAgreementOvertime,
  WorkSystem,
} from '@apps/attendance/domain/models/LegalAgreementOvertime';

export type Response = {
  legalAgreement: {
    monthlyOvertimeLimit: number;
    specialMonthlyOvertimeLimit: number;
    yearlyOvertimeLimit: number;
    specialYearlyOvertimeLimit: number;
    specialExtensionCountLimit: number;
  };
  overtimeHours: {
    monthlyOvertimeHours: number;
    monthlyOvertimeHours1MoAgo: number;
    monthlyOvertimeHours2MoAgo: number;
    specialMonthlyOvertimeHours: number;
    specialMonthlyOvertimeHours1MoAgo: number;
    specialMonthlyOvertimeHours2MoAgo: number;
    yearlyOvertimeHours: number;
    yearlyOvertimeHours1YearAgo: number;
    specialYearlyOvertimeHours: number;
    specialYearlyOvertimeHours1YearAgo: number;
    extensionCount: number;
  };
  legalAgreementWorkSystem: WorkSystem;
};

const convert = (response: Response): DomainLegalAgreementOvertime => {
  const { overtimeHours, legalAgreement, legalAgreementWorkSystem } = response;
  return {
    monthlyOvertime: {
      monthlyOvertimeHours: overtimeHours.monthlyOvertimeHours,
      monthlyOvertimeHours1MoAgo: overtimeHours.monthlyOvertimeHours1MoAgo,
      monthlyOvertimeHours2MoAgo: overtimeHours.monthlyOvertimeHours2MoAgo,
      monthlyOvertimeLimit: legalAgreement.monthlyOvertimeLimit,
      specialExtensionCountLimit: legalAgreement.specialExtensionCountLimit,
      extensionCount: overtimeHours.extensionCount,
      specialMonthlyOvertimeLimit: TimeUtil.toHours(
        legalAgreement.specialMonthlyOvertimeLimit
      ),
      specialMonthlyOvertimeHours: overtimeHours.specialMonthlyOvertimeHours,
      specialMonthlyOvertimeHours1MoAgo:
        overtimeHours.specialMonthlyOvertimeHours1MoAgo,
      specialMonthlyOvertimeHours2MoAgo:
        overtimeHours.specialMonthlyOvertimeHours2MoAgo,
    },
    yearlyOvertime: {
      yearlyOvertimeHours: overtimeHours.yearlyOvertimeHours,
      yearlyOvertimeHours1YearAgo: overtimeHours.yearlyOvertimeHours1YearAgo,
      yearlyOvertimeLimit: legalAgreement.yearlyOvertimeLimit,
      specialExtensionCountLimit: legalAgreement.specialExtensionCountLimit,
      extensionCount: overtimeHours.extensionCount,
      specialYearlyOvertimeLimit: TimeUtil.toHours(
        legalAgreement.specialYearlyOvertimeLimit
      ),
      specialYearlyOvertimeHours: overtimeHours.specialYearlyOvertimeHours,
      specialYearlyOvertimeHours1YearAgo:
        overtimeHours.specialYearlyOvertimeHours1YearAgo,
    },
    legalAgreementWorkSystem,
  };
};

const fetch: ILegalAgreementOvertimeRepository['fetch'] = async ({
  employeeId,
  targetDate,
}) => {
  const response: Response = await Api.invoke({
    path: '/att/legal-agreement/overtime/get',
    param: {
      empId: employeeId,
      targetDate,
    },
  });
  return convert(response);
};
export default fetch;
