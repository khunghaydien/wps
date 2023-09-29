export type ManagementType = 'None' | 'Hours' | 'StartEndTime' | 'Quantity';

// Express an entity as a type alias unless it has some methods
export type AllowanceDailyRecord = {
  recordDate: string;
  dailyAllowanceList: AllowanceRecord[];
};

export type AllowanceRecord = {
  allowanceName: string;
  allowanceCode: string;
  managementType: ManagementType;
  order: number | null | undefined;
  startTime: number | null | undefined;
  endTime: number | null | undefined;
  totalTime: number | null | undefined;
  quantity: number | null | undefined;
};

export type OwnerInfo = {
  startDate: string;
  endDate: string;
  employee: {
    name: string;
    code: string;
  };
  department: {
    name: string;
  };
  workingType: {
    name: string;
  };
};
