import { combineReducers } from 'redux';

import activeDialog from './activeDialog';
import approval from './approval';
import costCenterSelect from './costCenterSelect';
import expenseTypeSelect from './expenseTypeSelect';
import extendedItem from './extendedItem';
import isLoading from './isLoading';
import jobSelect from './jobSelect';
import recordClone from './recordClone';
import recordUpdated from './recordUpdated';
import vendor from './vendor';

export default combineReducers({
  activeDialog,
  approval,
  costCenterSelect,
  expenseTypeSelect,
  extendedItem,
  isLoading,
  jobSelect,
  vendor,
  recordClone,
  recordUpdated,
});
