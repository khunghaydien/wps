import { combineReducers } from 'redux';

import app from '@commons/modules/app';
import proxyEmployeeInfo from '@commons/modules/proxyEmployeeInfo';
import standaloneMode from '@commons/modules/standaloneMode';
import toast from '@commons/modules/toast';
import userSetting from '@commons/reducers/userSetting';

const rootReducer = combineReducers({
  app,
  proxyEmployeeInfo,
  standaloneMode,
  toast,
  userSetting,
});

export type State = ReturnType<typeof rootReducer>;

export default rootReducer;
