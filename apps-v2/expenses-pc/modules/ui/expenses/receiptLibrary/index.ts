import { combineReducers } from 'redux';

import maxSelectionCount from './maxSelectionCount';
import ocrDetail from './ocrDetail';
import selectedReceipt from './selectedReceipt';

export default combineReducers({
  ocrDetail,
  selectedReceipt,
  maxSelectionCount,
});
