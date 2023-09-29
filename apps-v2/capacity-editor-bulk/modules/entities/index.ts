import { combineReducers } from 'redux';

import { searchEmployeeMemberList } from '@apps/admin-pc/modules/employeeMemberLinkConfig/ui';

import capacityCompanyInfo from './capacityEditorCompanyInfo';

export default combineReducers({
  capacityCompanyInfo,
  searchEmployeeMemberList,
});
