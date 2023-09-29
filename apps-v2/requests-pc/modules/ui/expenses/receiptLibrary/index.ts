import { combineReducers } from 'redux';

import maxSelectionCount from './maxSelectionCount';
import selectedReceipt from './selectedReceipt';

export default combineReducers({
  maxSelectionCount,
  selectedReceipt,
});
