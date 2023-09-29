import { combineReducers } from 'redux';

import ocrPdfDocs from './ocrPdfDocs';
import reportList from './reportList';

const reducers = {
  reportList,
  ocrPdfDocs,
};

const rootReducer = combineReducers(reducers);
export type State = ReturnType<typeof rootReducer>;

export default rootReducer;
