/* eslint-disable @typescript-eslint/naming-convention */
const jobList = {
  jobList: [
    {
      parentId: 'a0i2v00000SSzknAAD',
      name: 'Expense Job',
      id: 'a0i2v00000SSzkmAAD',
      hasChildren: false,
      code: 'EXPENSE_JOB',
    },
  ],
};

export const jobSearchResult = {
  records: [
    {
      validDateTo: '2100-01-01',
      validDateFrom: '2018-06-19',
      parentId: null,
      parent: {
        name: null,
        code: null,
      },
      name_L2: null,
      name_L1: null,
      name_L0: 'General Job',
      name: 'General Job',
      jobTypeId: 'a0h2v00000W4JtpAAF',
      jobType: {
        name: 'Default Job type',
        code: 'DEF_JOB_TYPE',
      },
      jobOwnerId: null,
      jobOwner: {
        name: null,
        code: null,
      },
      isSelectableTimeTrack: true,
      isSelectableExpense: true,
      isScopedAssignment: false,
      isDirectCharged: true,
      id: 'a0i2v00000SSzknAAD',
      hierarchyParentNameList: [],
      hasChildren: true,
      departmentId: null,
      department: {
        name: null,
        code: null,
      },
      companyId: 'a0N2v00000VuxjtEAB',
      code: 'GENERAL_JOB',
    },
  ],
};

export const jobRecentList = {
  records: [
    {
      validDateTo: '2100-01-01',
      validDateFrom: '2018-06-19',
      parentId: 'a0i2v00000SSzknAAD',
      parent: {
        name: 'General Job',
        code: 'GENERAL_JOB',
      },
      name_L2: null,
      name_L1: null,
      name_L0: 'Expense Job',
      name: 'Expense Job',
      jobTypeId: 'a0h2v00000W4JtpAAF',
      jobType: {
        name: 'Default Job type',
        code: 'DEF_JOB_TYPE',
      },
      jobOwnerId: null,
      jobOwner: {
        name: null,
        code: null,
      },
      isSelectableTimeTrack: false,
      isSelectableExpense: true,
      isScopedAssignment: false,
      isDirectCharged: true,
      id: 'a0i2v00000SSzkmAAD',
      hierarchyParentNameList: ['General Job'],
      hasChildren: false,
      departmentId: null,
      department: {
        name: null,
        code: null,
      },
      companyId: 'a0N2v00000VuxjtEAB',
      code: 'EXPENSE_JOB',
    },
  ],
};

export default jobList;
