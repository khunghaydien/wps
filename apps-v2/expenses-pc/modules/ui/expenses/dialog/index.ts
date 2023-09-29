import { combineReducers } from 'redux';

import costCenterSelect from '../../../../../commons/modules/costCenterDialog/ui/list';

import ICTransactionSelect from './ICTransactionSelect';
import transactionSelect from './transactionSelect';

import activeDialog from './activeDialog';
import approval from './approval';
import expenseTypeSelect from './expenseTypeSelect';
import extendedItem from './extendedItem';
import isLoading from './isLoading';
import jobSelect from './jobSelect';
import progressBar from './progressBar';
import recordClone from './recordClone';
import recordUpdated from './recordUpdated';
import vendor from './vendor';

export default combineReducers({
  activeDialog,
  approval,
  costCenterSelect,
  expenseTypeSelect,
  jobSelect,
  isLoading,
  transactionSelect,
  ICTransactionSelect,
  extendedItem,
  vendor,
  progressBar,
  recordClone,
  recordUpdated,
});
