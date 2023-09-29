/**
 * 勤務表の所有者情報
 */
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
