import { combineReducers } from 'redux';

import PersonalMenuPopover from '@apps/commons/modules/widgets/PersonalMenuPopover';

import ProxyEmployeeSelectDialog from '@widgets/dialogs/ProxyEmployeeSelectDialog/modules';

export default combineReducers({
  PersonalMenuPopover,
  ProxyEmployeeSelectDialog,
});
