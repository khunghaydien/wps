export type DailyRestRecord = {
  recordDate: string;
  restRecords: RestRecord[];
};

export type RestRecord = {
  id: string;
  restReasonId: string;
  restReasonName: string;
  restReasonCode: string;
  outStartTime: number | null | undefined;
  outEndTime: number | null | undefined;
  outRestTime: number | null | undefined;
};

export type IDailyRestRecordRepository = {
  search: (parameters: {
    startDate: string;
    endDate: string;
    employeeId?: string;
  }) => Promise<DailyRestRecord[]>;
};
