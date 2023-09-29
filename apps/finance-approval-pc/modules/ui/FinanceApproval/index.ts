import { combineReducers } from 'redux';

import companyCount from './companyCount';
import companySwitch from './companySwitch';
import dialog from './dialog';
import DropdownValues from './DropdownValues';
import reportCloneLink from './reportCloneLink';
import RequestList from './RequestList';

export default combineReducers({
  RequestList,
  dialog,
  DropdownValues,
  companySwitch,
  companyCount,
  reportCloneLink,
});
