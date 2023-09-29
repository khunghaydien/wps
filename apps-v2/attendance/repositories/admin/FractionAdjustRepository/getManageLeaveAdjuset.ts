import Api from '@apps/commons/api';

import { IAdjustFractionRepository } from '@apps/attendance/domain/models/admin/FractionGrant';

type Response = Readonly<{
  validDateFrom: string;
  adjustmentType: string;
}>;

const getManageLeaveAdjuset: IAdjustFractionRepository['getManageLeaveAdjuset'] =
  async ({ employeeId, grantId }) => {
    const response: Response = await Api.invoke({
      path: '/att/managed-leave/fraction-adjustment/get',
      param: { empId: employeeId, grantId },
    });
    return response;
  };

export default getManageLeaveAdjuset;
