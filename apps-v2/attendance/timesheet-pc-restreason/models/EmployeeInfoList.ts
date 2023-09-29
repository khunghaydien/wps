export type EmployeeInfoList = {
  startDate: string | null | undefined;
  endDate: string | null | undefined;
  department: {
    name: string | null | undefined;
    id: string | null | undefined;
    code: string | null | undefined;
  };
  workingType: {
    name: string | null | undefined;
    id: string | null | undefined;
    code: string | null | undefined;
  };
};
