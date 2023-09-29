import { combineReducers } from 'redux';

import delegateApplicant from './delegateApplicant';
import dialog from './dialog';
import mode from './mode';
import overlap from './overlap';
import receiptLibrary from './receiptLibrary';
import recordItemPane from './recordItemPane';
import recordListPane from './recordListPane';
import reportList from './reportList';
import reportTypeLoading from './reportTypeLoading';
import selectedExpReport from './selectedExpReport';
import tab from './tab';
import view from './view';

export default combineReducers({
  dialog,
  mode,
  overlap,
  receiptLibrary,
  recordItemPane,
  recordListPane,
  reportList,
  selectedExpReport,
  tab,
  view,
  delegateApplicant,
  reportTypeLoading,
});
