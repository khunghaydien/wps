import { combineReducers } from 'redux';

import advSearch from './advSearch';
import creditCard from './creditCard';
import customHint from './customHint';
import employeeHistory from './employeeHistory';
import general from './general';
import icCard from './icCard';
import ocrDetail from './ocrDetail';
import record from './record';
import report from './report';
import reportTypeSelectDialog from './reportTypeSelectDialog';
import selectedExpType from './selectedExpType';
import selectedOCRReceipt from './selectedOCRReceipt';
import tax from './tax';

export default combineReducers({
  customHint,
  general,
  report,
  record,
  tax,
  icCard,
  creditCard,
  reportTypeSelectDialog,
  selectedExpType,
  employeeHistory,
  ocrDetail,
  selectedOCRReceipt,
  advSearch,
});
