export type FractionGrantRecord = {
  validDateFrom: string; // 有効開始日
  adjustmentType: string; // 付与日数
};

export type TempFractionGrantRecord = {
  validDateFrom: string; // 有効開始日
  validDateTo: string; // 失効日
  adjustmentType: string; // 付与日数
  comment: string; // コメント
};

export const update = (
  record: TempFractionGrantRecord,
  key: string,
  value: TempFractionGrantRecord[keyof TempFractionGrantRecord]
): TempFractionGrantRecord => ({
  ...record,
  [key]: value,
});

export type IAdjustFractionRepository = {
  getAnnualLeaveAdjuset: (param: {
    employeeId: string;
    grantId: string;
  }) => Promise<FractionGrantRecord>;
  getManageLeaveAdjuset: (param: {
    employeeId: string;
    grantId: string;
  }) => Promise<FractionGrantRecord>;
  createAnnualLeaveAdjuset: (param: {
    employeeId: string;
    grantId: string;
    adjustmentType: string;
    validDateFrom: string;
    validDateTo: string;
    comment: string;
  }) => Promise<void>;
  createManageLeaveAdjuset: (param: {
    employeeId: string;
    grantId: string;
    adjustmentType: string;
    validDateFrom: string;
    validDateTo: string;
    comment: string;
  }) => Promise<void>;
};
