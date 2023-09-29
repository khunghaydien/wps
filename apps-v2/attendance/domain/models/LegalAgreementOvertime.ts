export type MonthlyOvertime = {
  monthlyOvertimeHours: number;
  monthlyOvertimeHours1MoAgo: number;
  monthlyOvertimeHours2MoAgo: number;
  monthlyOvertimeLimit: number;
  specialExtensionCountLimit: number;
  extensionCount: number;
  specialMonthlyOvertimeLimit: number;
  specialMonthlyOvertimeHours: number;
  specialMonthlyOvertimeHours1MoAgo: number;
  specialMonthlyOvertimeHours2MoAgo: number;
};

export type YearlyOvertime = {
  yearlyOvertimeHours: number;
  yearlyOvertimeHours1YearAgo: number;
  yearlyOvertimeLimit: number;
  specialExtensionCountLimit: number;
  extensionCount: number;
  specialYearlyOvertimeLimit: number;
  specialYearlyOvertimeHours: number;
  specialYearlyOvertimeHours1YearAgo: number;
};

export const WORK_SYSTEM = {
  MANAGER: 'Manager',
  MODIFIED_YEARLY: 'ModifiedYearly',
  OTHERS: 'Others',
} as const;

export type WorkSystem = Value<typeof WORK_SYSTEM>;

export type LegalAgreementOvertime = {
  monthlyOvertime: MonthlyOvertime;
  yearlyOvertime: YearlyOvertime;
  legalAgreementWorkSystem: WorkSystem;
};

export type ILegalAgreementOvertimeRepository = {
  fetch: (param: {
    employeeId: string | null;
    targetDate: string;
  }) => Promise<LegalAgreementOvertime>;
};
