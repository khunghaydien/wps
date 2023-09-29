export type RestTimeReason = {
  id: string;
  code: string;
  name: string;
};

export type IRestTimeReasonRepository = {
  fetchList: (param: {
    employeeId?: string;
    targetDate: string;
  }) => Promise<RestTimeReason[]>;
};
