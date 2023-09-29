import { combineReducers } from 'redux';

import PersonalMenuPopover from '../../commons/modules/widgets/PersonalMenuPopover';

import ApprovalHistoryDialog from '../../../widgets/dialogs/ApprovalHistoryDialog/modules';
import ProxyEmployeeSelectDialog from '../../../widgets/dialogs/ProxyEmployeeSelectDialog/modules';

export default combineReducers({
  PersonalMenuPopover,
  ApprovalHistoryDialog,
  ProxyEmployeeSelectDialog,
});
