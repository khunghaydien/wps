export const PRODUCT_CATEGORY = {
  COMMON: 'Common',
  ATTENDANCE: 'Attendance',
  TIME_TRACKING: 'TimeTracking',
  EXPENSE: 'Expense',
  PSA: 'PSA',
};

export const options = [
  {
    label: 'Admin_Lbl_Common',
    msgkey: 'Admin_Lbl_Common',
    value: PRODUCT_CATEGORY.COMMON,
  },
  {
    label: 'Admin_Lbl_EmpSectAttendance',
    msgkey: 'Admin_Lbl_EmpSectAttendance',
    value: PRODUCT_CATEGORY.ATTENDANCE,
  },
  {
    label: 'Admin_Lbl_EmpSectTimeTracking',
    msgkey: 'Admin_Lbl_EmpSectTimeTracking',
    value: PRODUCT_CATEGORY.TIME_TRACKING,
  },
  {
    label: 'Admin_Lbl_EmpSectExpense',
    msgkey: 'Admin_Lbl_EmpSectExpense',
    value: PRODUCT_CATEGORY.EXPENSE,
  },
  {
    label: 'Admin_Lbl_EmpSectProject',
    msgkey: 'Admin_Lbl_EmpSectProject',
    value: PRODUCT_CATEGORY.PSA,
  },
];

export const scopeOfDelegatedUsersOperation = [
  {
    label: 'Admin_Lbl_ApproveAccessibleUserAndApproverAttRequestByDelegate',
    msgkey: 'Admin_Lbl_ApproveAccessibleUserAndApproverAttRequestByDelegate',
    value: 'true',
  },
  {
    label: 'Admin_Lbl_ApproveAccessibleUserAttRequestByDelegate',
    msgkey: 'Admin_Lbl_ApproveAccessibleUserAttRequestByDelegate',
    value: 'false',
  },
];
