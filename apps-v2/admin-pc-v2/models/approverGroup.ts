type Department = {
  code: string;
  name: string;
};

export type Approver = {
  id?: string;
  username?: string;
};

export type ApproverGroup = {
  id: string;
  companyId: string;
  code: string;
  department: Department;
  name: string;
  name_L0: string;
  name_L1: string;
  name_L2: string;
  queueId: string;
  attQueueId: string;
  expQueueId: string;
  generalQueueId: string;
  timeQueueId: string;
  type: keyof typeof TYPE_LABELS;
  targetDepartmentId: string;
  lastUpdatedAt: string;
};

export const TYPE_LABELS = {
  DeptManagers: 'Admin_Lbl_DepartmentManagers',
  DeptMembers: 'Admin_Lbl_DepartmentMembers',
  SpecificUsers: 'Admin_Lbl_SpecificUsers',
};

export const APPROVER_MODULES = {
  attQueueId: 'Admin_Lbl_EmpSectAttendance',
  expQueueId: 'Admin_Lbl_EmpSectExpense',
  timeQueueId: 'Admin_Lbl_EmpSectTimeTracking',
  generalQueueId: 'Admin_Lbl_CustomRequest',
};
