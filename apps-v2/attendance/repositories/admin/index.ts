import { IAdjustFractionRepository } from '@apps/attendance/domain/models/admin/FractionGrant';

import createAnnualLeaveAdjuset from './FractionAdjustRepository/createAnnualLeaveAdjuset';
import createManageLeaveAdjuset from './FractionAdjustRepository/createManageLeaveAdjuset';
import getAnnualLeaveAdjuset from './FractionAdjustRepository/getAnnualLeaveAdjuset';
import getManageLeaveAdjuset from './FractionAdjustRepository/getManageLeaveAdjuset';

const repository: IAdjustFractionRepository = {
  createAnnualLeaveAdjuset,
  createManageLeaveAdjuset,
  getAnnualLeaveAdjuset,
  getManageLeaveAdjuset,
};

export default repository;
