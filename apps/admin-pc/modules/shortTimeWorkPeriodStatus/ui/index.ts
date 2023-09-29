import { combineReducers } from 'redux';

import editingEntryPeriodStatus from './editingEntryPeriodStatus';
import editingUpdatePeriodStatus from './editingUpdatePeriodStatus';

const reducers = combineReducers({
  editingEntryPeriodStatus,
  editingUpdatePeriodStatus,
});

export type State = ReturnType<typeof reducers>;

export default reducers;
