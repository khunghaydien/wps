export type GrantHistoryRecord = {
  id: string;
  validDateFrom: string | null | undefined;
  validDateTo: string | null | undefined;
  daysGranted: number;
  hoursGranted: number;
  daysLeft: number;
  hoursLeft: number;
  comment: string | null | undefined;
};
