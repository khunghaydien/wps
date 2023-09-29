export type Job = {
  id: string;
  name: string;
  name_L0: string;
  name_L1: string;
  name_L2: string;
  code: string;
  companyId: string;
  /* invisible in April'21  */
  // jobTypeId?: string;
  // jobType?: {
  //   name: string;
  // };
  departmentId: string;
  department: {
    name: string;
  };
  parentId: string;
  parent: {
    name: string;
    code: string;
  };
  jobOwnerId: string;
  jobOwner: {
    name: string;
    code: string;
  };
  validDateFrom: string;
  validDateTo: string;
  validDateThrough?: string;
  hasChildren: boolean;
  isEditLocked: boolean;
};

export const defaultValue: Job = {
  id: '',
  name: '',
  name_L0: '',
  name_L1: '',
  name_L2: '',
  code: '',
  companyId: '',
  departmentId: '',
  department: {
    name: '',
  },
  parentId: '',
  parent: {
    name: '',
    code: '',
  },
  jobOwnerId: '',
  jobOwner: {
    name: '',
    code: '',
  },
  validDateFrom: '',
  validDateTo: '',
  hasChildren: false,
  isEditLocked: false,
};

export default defaultValue;
