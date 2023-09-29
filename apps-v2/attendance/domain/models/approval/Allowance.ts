export type DailyAllowanceRecord = {
  recordDate: string;
  dailyAllowanceList: DailyAllowanceList[];
};

export type DailyAllowanceList = {
  id: string;
  allowanceName: string;
  allowanceCode: string;
  managementType: string;
  order: number | null | undefined;
  startTime: number | null | undefined;
  endTime: number | null | undefined;
  totalTime: number | null | undefined;
  quantity: number | null | undefined;
};
