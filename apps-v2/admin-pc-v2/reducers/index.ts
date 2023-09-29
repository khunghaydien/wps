import { combineReducers } from 'redux';

import approverGroup from '../modules/approverGroup';
import department from '../modules/department';
import departmentManager from '../modules/departmentManager';
import employee from '../modules/employee';
import featureAccess from '../modules/featureAccess';
import organizationHierarchy from '../modules/organizationHierarchy';
import paymentMethod from '../modules/paymentMethod';

import { reducers as reducersV1 } from '@admin-pc/reducers';

import approverSetting from './approverSetting';
import mileageRate from './mileageRate';
import recordAccess from './recordAccess';
import searchOrganizationHierarchy from './searchOrganizationHierarchy';
import searchPosition from './searchPosition';

export const reducers = {
  ...reducersV1,
  approverGroup,
  approverSetting,
  featureAccess,
  paymentMethod,
  searchPosition,
  searchOrganizationHierarchy,
  employee,
  department,
  departmentManager,
  recordAccess,
  mileageRate,
  organizationHierarchy,
};

const rootReducer = combineReducers(reducers);
export type State = ReturnType<typeof rootReducer>;
export default rootReducer;
