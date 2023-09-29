import { combineReducers } from 'redux';

import expTaxTypeList from '../../domain/modules/exp/taxType';
import accessControl from '../modules/accessControl';
import app from '../modules/app';
import approverEmployeeSearch from '../modules/approverEmployeeSearch';
import approverEmployeeSetting from '../modules/approverEmployeeSetting';
import delegateApprovalDialog from '../modules/delegateApprovalDialog';
import jobSelectDialog from '../modules/jobSelectDialog';
import personalSetting from '../modules/personalSetting';
import personalSettingDialog from '../modules/personalSettingDialog';
import proxyEmployeeInfo from '../modules/proxyEmployeeInfo';
import standaloneMode from '../modules/standaloneMode';
import toast from '../modules/toast';

import approvalHistoryList from './approvalHistoryList';
import costCenterList from './costCenterList';
import currencyList from './currencyList';
import dialog from './dialog';
import empInfo from './empInfo';
import expTypeList from './expTypeList';
import jobList from './jobList';
import searchedRoute from './searchedRoute';
import selectedTab from './selectedTab';
import stampWidget from './stampWidget';
import stationHistoryList from './stationHistoryList';
import suggestInput from './suggestInput';
import targetEmpId from './targetEmpId';
import userSetting from './userSetting';

const reducers = {
  app,
  accessControl,
  dialog,
  delegateApprovalDialog,
  empInfo,
  proxyEmployeeInfo,
  targetEmpId,
  approverEmployeeSetting,
  approverEmployeeSearch,
  approvalHistoryList,
  jobList,
  expTypeList,
  expTaxTypeList,
  costCenterList,
  selectedTab,
  currencyList,
  suggestInput,
  searchedRoute,
  standaloneMode,
  stationHistoryList,
  userSetting,
  personalSetting,
  personalSettingDialog,
  jobSelectDialog,
  stampWidget,
  toast,
};

const rootReducer = combineReducers(reducers);
export type State = ReturnType<typeof rootReducer>;

export default rootReducer;
