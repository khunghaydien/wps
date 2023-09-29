import DateUtil from '../../../commons/utils/DateUtil';

import { RouteItem } from '../exp/jorudan/Route';

export type MasterEmployeeHistory = {
  id: string;
  baseId: string;
  primary: boolean;
  subRoleKey: string;
  departmentId: string;
  isRemoved?: boolean;
  department: {
    name: string;
    code?: string;
  };
  title: string;
  title_L0: string;
  title_L1: string;
  title_L2: string;
  additionalDepartmentId: string;
  additionalTitle_L0: string;
  additionalTitle_L1: string;
  additionalTitle_L2: string;
  managerId: string;
  manager: {
    name: string;
    code: string;
  };
  validDateFrom: string;
  validDateTo: string;
  comment: string;
  workingTypeId: string;
  workingType: {
    name: string;
  };
  timeSettingId: string;
  timeSetting: {
    name: string;
  };
  agreementAlertSettingId: string;
  agreementAlertSetting: {
    name: string;
  };
  calendarId: string;
  permissionId: string;
  costCenterId: string;
  expEmployeeGroupId: string;
  approver01Id: string;
  approver01: {
    name: string;
    code: string;
  };
  approver02Id: string;
  approver02: {
    name: string;
    code: string;
  };
  approver03Id: string;
  approver03: {
    name: string;
    code: string;
  };
  approver04Id: string;
  approver04: {
    name: string;
    code: string;
  };
  approver05Id: string;
  approver05: {
    name: string;
    code: string;
  };
  approver06Id: string;
  approver06: {
    name: string;
    code: string;
  };
  approver07Id: string;
  approver07: {
    name: string;
    code: string;
  };
  approver08Id: string;
  approver08: {
    name: string;
    code: string;
  };
  approver09Id: string;
  approver09: {
    name: string;
    code: string;
  };
  approver10Id: string;
  approver10: {
    name: string;
    code: string;
  };
  approvalAuthority01: string;
  commuterPassAvailable: string;
  jorudanRoute: RouteItem | null;
  jobGradeId: string;
  userData01: string;
  userData02: string;
  userData03: string;
  userData04: string;
  userData05: string;
  userData06: string;
  userData07: string;
  userData08: string;
  userData09: string;
  userData10: string;
  revisionType: string;
  companyId?: string;
  positionId?: string;
  position?: {
    name: string;
    code: string;
  };
};

export const defaultValue: MasterEmployeeHistory = {
  primary: false,
  revisionType: '',
  subRoleKey: '',
  id: '',
  baseId: '',
  departmentId: '',
  department: {
    name: '',
  },
  title: '',
  title_L0: '',
  title_L1: '',
  title_L2: '',
  additionalDepartmentId: '',
  additionalTitle_L0: '',
  additionalTitle_L1: '',
  additionalTitle_L2: '',
  managerId: '',
  manager: {
    name: '',
    code: '',
  },
  validDateFrom: '',
  validDateTo: '',
  comment: '',
  workingTypeId: '',
  workingType: {
    name: '',
  },
  timeSettingId: '',
  timeSetting: {
    name: '',
  },
  agreementAlertSettingId: '',
  agreementAlertSetting: {
    name: '',
  },
  calendarId: '',
  permissionId: '',
  costCenterId: '',
  expEmployeeGroupId: '',
  approver01Id: '',
  approver01: {
    name: '',
    code: '',
  },
  approver02Id: '',
  approver02: {
    name: '',
    code: '',
  },
  approver03Id: '',
  approver03: {
    name: '',
    code: '',
  },
  approver04Id: '',
  approver04: {
    name: '',
    code: '',
  },
  approver05Id: '',
  approver05: {
    name: '',
    code: '',
  },
  approver06Id: '',
  approver06: {
    name: '',
    code: '',
  },
  approver07Id: '',
  approver07: {
    name: '',
    code: '',
  },
  approver08Id: '',
  approver08: {
    name: '',
    code: '',
  },
  approver09Id: '',
  approver09: {
    name: '',
    code: '',
  },
  approver10Id: '',
  approver10: {
    name: '',
    code: '',
  },
  approvalAuthority01: '',
  commuterPassAvailable: '',
  jorudanRoute: null,
  jobGradeId: '',
  userData01: '',
  userData02: '',
  userData03: '',
  userData04: '',
  userData05: '',
  userData06: '',
  userData07: '',
  userData08: '',
  userData09: '',
  userData10: '',
};

export const getClosest = (
  targetDate: string,
  records: MasterEmployeeHistory[]
): MasterEmployeeHistory | null => {
  if (!records.length) {
    return null;
  }

  const targetMsec = DateUtil.toUnixMsec(targetDate);
  let closest = records[0];

  records.forEach((record) => {
    const closestMsec = DateUtil.toUnixMsec(closest.validDateFrom);
    const currentMsec = DateUtil.toUnixMsec(record.validDateFrom);
    const closestDiff = Math.abs(targetMsec - closestMsec);
    const currentDiff = Math.abs(targetMsec - currentMsec);

    if (
      closest.validDateFrom > targetDate &&
      record.validDateFrom <= targetDate
    ) {
      closest = record;
    } else if (currentDiff < closestDiff) {
      closest = record;
    }
  });

  return closest;
};
