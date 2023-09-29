import { combineReducers } from 'redux';

import detailPane from './detailPane';
import timeRecordItemImportList from './timeRecordItemImportList';

const reducers = combineReducers({
  detailPane,
  timeRecordItemImportList,
});

export type State = ReturnType<typeof reducers>;

export default reducers;
