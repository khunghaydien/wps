import { combineReducers } from 'redux';

import accessControl from './accessControl';
import app from './app';
import costCenterDialog from './costCenterDialog';
import delegateApprovalDialog from './delegateApprovalDialog';
import exp from './exp';
import proxyEmployeeInfo from './proxyEmployeeInfo';
import standaloneMode from './standaloneMode';
import toast from './toast';

const reducers = {
  app,
  accessControl,
  standaloneMode,
  proxyEmployeeInfo,
  delegateApprovalDialog,
  toast,
  exp,
  costCenterDialog,
};

const rootReducer = combineReducers(reducers);
export type State = ReturnType<typeof rootReducer>;

export default rootReducer;
