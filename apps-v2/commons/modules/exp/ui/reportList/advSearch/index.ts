import { combineReducers } from 'redux';

import accountingDateRange from './accountingDateRange';
import amountRange from './amountRange';
import costCenterBaseIds from './costCenterBaseIds';
import departmentBaseIds from './departmentBaseIds';
import detail from './detail';
import empBaseIds from './empBaseIds';
import financeStatusList from './financeStatusList';
import reportNo from './reportNo';
import reportTypeIds from './reportTypeIds';
import requestDateRange from './requestDateRange';
import statusList from './statusList';
import subject from './subject';
import vendorIds from './vendorIds';

export default combineReducers({
  requestDateRange,
  accountingDateRange,
  amountRange,
  reportTypeIds,
  vendorIds,
  reportNo,
  detail,
  subject,
  costCenterBaseIds,
  empBaseIds,
  departmentBaseIds,
  financeStatusList,
  statusList,
});

export { actions as reportNoActions } from './reportNo';
export { actions as subjectActions } from './subject';
export { actions as vendorIdsActions } from './vendorIds';
export { actions as reportDateActions } from './accountingDateRange';
export { actions as amountActions } from './amountRange';
export { actions as costCenterActions } from './costCenterBaseIds';
export { actions as departmentActions } from './departmentBaseIds';
export { actions as employeeActions } from './empBaseIds';
export { actions as extraConditionsActions } from './detail';
export { actions as FAStatusActions } from './financeStatusList';
export { actions as reportTypeActions } from './reportTypeIds';
export { actions as requestDateRangeActions } from './requestDateRange';
export { actions as statusListActions } from './statusList';
