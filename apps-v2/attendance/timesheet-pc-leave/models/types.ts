export type LeaveRange = 'Day' | 'AM' | 'PM' | 'Half' | 'Time';

// Express an entity as a type alias unless it has some methods
export type LeaveDetail = {
  requestId: string;
  startDate: string;
  endDate: string;
  name: string;
  range: LeaveRange;
  days: number | null | undefined;
  leaveTime: number | null | undefined;
  remarks: string | null | undefined;
};

export type GrantedAndTaken = {
  validDateFrom: string;
  validDateTo: string;
  daysGranted: number;
  daysTaken: number;
  hoursTaken: number;
  daysLeft: number;
  hoursLeft: number;
  comment: string | null | undefined;
};

// export type TotalGrantedAndTaken = {
// };

export type DaysManagedLeave = {
  leaveName: string | null | undefined;
  leaveType: 'Paid' | 'Unpaid' | 'Compensatory';
  daysGrantedTotal: number;
  daysTakenTotal: number;
  hoursTakenTotal: number;
  daysLeftTotal: number;
  hoursLeftTotal: number;
  grants: GrantedAndTaken[];
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
