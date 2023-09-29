import Api from '@apps/commons/api';

import { IAdjustFractionRepository } from '@apps/attendance/domain/models/admin/FractionGrant';

type Response = Readonly<{
  validDateFrom: string;
  adjustmentType: string;
}>;

const getAnnualLeaveAdjuset: IAdjustFractionRepository['getAnnualLeaveAdjuset'] =
  async ({ employeeId, grantId }) => {
    const response: Response = await Api.invoke({
      path: '/att/annual-leave/fraction-adjustment/get',
      param: { empId: employeeId, grantId },
    });
    return response;
  };

export default getAnnualLeaveAdjuset;
