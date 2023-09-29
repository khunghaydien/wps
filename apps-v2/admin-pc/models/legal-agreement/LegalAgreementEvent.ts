export type LimitEvent = {
  monthlyOvertimeLimit: number;
  monthlyOvertimeWarning1: number;
  monthlyOvertimeWarning2: number;
  yearlyOvertimeLimit: number;
  yearlyOvertimeWarning1: number;
  yearlyOvertimeWarning2: number;
  multiMonthOvertimeLimit: number;
  multiMonthOvertimeWarning1: number;
  multiMonthOvertimeWarning2: number;
};

export type SpecialEvent = {
  specialMonthlyOvertimeLimit: number;
  specialMonthlyOvertimeWarning1: number;
  specialMonthlyOvertimeWarning2: number;
  specialYearlyOvertimeLimit: number;
  specialYearlyOvertimeWarning1: number;
  specialYearlyOvertimeWarning2: number;
  specialMultiMonthOvertimeLimit: number;
  specialMultiMonthOvertimeWarning1: number;
  specialMultiMonthOvertimeWarning2: number;
  specialExtensionCountLimit: number;
  specialExtensionCountWarning1: number;
  specialExtensionCountWarning2: number;
};
