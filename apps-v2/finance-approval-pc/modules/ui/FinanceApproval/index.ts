import { combineReducers } from 'redux';

import bulkApproval from './bulkApproval';
import companyCount from './companyCount';
import companySwitch from './companySwitch';
import dialog from './dialog';
import DropdownValues from './DropdownValues';
import isApexView from './isApexView';
import reportCloneLink from './reportCloneLink';
import RequestList from './RequestList';
import tabs from './tabs';

export default combineReducers({
  RequestList,
  dialog,
  DropdownValues,
  companySwitch,
  companyCount,
  reportCloneLink,
  tabs,
  bulkApproval,
  isApexView,
});
