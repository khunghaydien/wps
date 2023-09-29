import { combineReducers } from 'redux';

import PersonalMenuPopover from '../../commons/modules/widgets/PersonalMenuPopover';

import SwitchApproverDialog from '../../../widgets/dialogs/SwitchApporverDialog/modules';

export default combineReducers({
  PersonalMenuPopover,
  SwitchApproverDialog,
});
