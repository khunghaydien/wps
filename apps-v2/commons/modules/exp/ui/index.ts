import { combineReducers } from 'redux';

import bulkEditRecord from './bulkEditRecord';
import eventListPopup from './eventListPopup';
import itemizationLoading from './itemizationLoading';
import ocrPdfDocs from './ocrPdfDocs';
import paymentMethodOption from './paymentMethodOption';
import reportList from './reportList';

const reducers = {
  bulkEditRecord,
  eventListPopup,
  itemizationLoading,
  reportList,
  paymentMethodOption,
  ocrPdfDocs,
};

const rootReducer = combineReducers(reducers);
export type State = ReturnType<typeof rootReducer>;

export default rootReducer;
