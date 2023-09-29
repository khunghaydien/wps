import { LimitEvent, SpecialEvent } from './LegalAgreementEvent';

export type LegalAgreementListItem = {
  id: string;
  code: string;
  name: string;
  name_L0: string;
  name_L1: string;
  name_L2: string;
};

export type LimitListObj = {
  monthlyOvertime: string;
  yearlyOvertime: string;
  multiMonthOvertime: string;
};

export type LegalAgreementHistory = {
  id: string;
  baseId: string;
  validDateFrom: string;
  validDateTo: string;
  comment: string;
  standardWorkHoursType: string;
  useStandardContractedWorkHours: boolean;
  standardContractedWorkHours: number;
  includeHolidayWorkHours: boolean;
  includeLegalHolidayWorkHours: boolean;
} & LimitEvent &
  SpecialEvent;

export const convertToLimitEvent = (
  history: LegalAgreementHistory
): LimitEvent => ({
  monthlyOvertimeLimit: history.monthlyOvertimeLimit,
  monthlyOvertimeWarning1: history.monthlyOvertimeWarning1,
  monthlyOvertimeWarning2: history.monthlyOvertimeWarning2,
  yearlyOvertimeLimit: history.yearlyOvertimeLimit,
  yearlyOvertimeWarning1: history.yearlyOvertimeWarning1,
  yearlyOvertimeWarning2: history.yearlyOvertimeWarning2,
  multiMonthOvertimeLimit: history.multiMonthOvertimeLimit,
  multiMonthOvertimeWarning1: history.multiMonthOvertimeWarning1,
  multiMonthOvertimeWarning2: history.multiMonthOvertimeWarning2,
});

export const convertToSpecialEvent = (
  history: LegalAgreementHistory
): SpecialEvent => ({
  specialMonthlyOvertimeLimit: history.specialMonthlyOvertimeLimit,
  specialMonthlyOvertimeWarning1: history.specialMonthlyOvertimeWarning1,
  specialMonthlyOvertimeWarning2: history.specialMonthlyOvertimeWarning2,
  specialYearlyOvertimeLimit: history.specialYearlyOvertimeLimit,
  specialYearlyOvertimeWarning1: history.specialYearlyOvertimeWarning1,
  specialYearlyOvertimeWarning2: history.specialYearlyOvertimeWarning2,
  specialMultiMonthOvertimeLimit: history.specialMultiMonthOvertimeLimit,
  specialMultiMonthOvertimeWarning1: history.specialMultiMonthOvertimeWarning1,
  specialMultiMonthOvertimeWarning2: history.specialMultiMonthOvertimeWarning2,
  specialExtensionCountLimit: history.specialExtensionCountLimit,
  specialExtensionCountWarning1: history.specialExtensionCountWarning1,
  specialExtensionCountWarning2: history.specialExtensionCountWarning2,
});
