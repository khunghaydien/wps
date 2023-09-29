import Api from '@apps/commons/api';

import { IAdjustFractionRepository } from '@apps/attendance/domain/models/admin/FractionGrant';

const createManageLeaveAdjuset: IAdjustFractionRepository['createManageLeaveAdjuset'] =
  async ({
    employeeId,
    grantId,
    adjustmentType,
    validDateFrom,
    validDateTo,
    comment,
  }) => {
    await Api.invoke({
      path: '/att/managed-leave/fraction-adjustment/create',
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

export default createManageLeaveAdjuset;
