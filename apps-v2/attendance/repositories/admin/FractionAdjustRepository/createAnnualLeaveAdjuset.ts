import Api from '@apps/commons/api';

import { IAdjustFractionRepository } from '@apps/attendance/domain/models/admin/FractionGrant';

const createAnnualLeaveAdjuset: IAdjustFractionRepository['createAnnualLeaveAdjuset'] =
  async ({
    employeeId,
    grantId,
    adjustmentType,
    validDateFrom,
    validDateTo,
    comment,
  }) => {
    await Api.invoke({
      path: '/att/annual-leave/fraction-adjustment/create',
      param: {
        empId: employeeId,
        grantId,
        adjustmentType,
        validDateFrom,
        validDateTo,
        comment,
      },
    });
  };

export default createAnnualLeaveAdjuset;
