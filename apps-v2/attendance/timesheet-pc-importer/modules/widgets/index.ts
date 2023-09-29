import { combineReducers } from 'redux';

import PersonalMenuPopover from '@commons/modules/widgets/PersonalMenuPopover';

import ProxyEmployeeSelectDialog from '../../../../../widgets/dialogs/ProxyEmployeeSelectDialog/modules';

const rootReducer = combineReducers({
  PersonalMenuPopover,
  ProxyEmployeeSelectDialog,
});

export type State = ReturnType<typeof rootReducer>;

export default rootReducer;
