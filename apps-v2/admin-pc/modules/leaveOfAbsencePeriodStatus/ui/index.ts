import { combineReducers } from 'redux';

import editingEntryPeriodStatus from './editingEntryPeriodStatus';
import editingUpdatePeriodStatus from './editingUpdatePeriodStatus';

export default combineReducers({
  editingEntryPeriodStatus,
  editingUpdatePeriodStatus,
});
