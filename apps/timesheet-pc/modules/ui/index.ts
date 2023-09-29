import { combineReducers } from 'redux';

import approvalHistory from './approvalHistory';
import dailyAttentions from './dailyAttentions';
import dailyRequest from './dailyRequest';
import dailyTimeTrack from './dailyTimeTrack';
import editingDailyAttTime from './editingDailyAttTime';
import editingDailyRemarks from './editingDailyRemarks';
import editingFixSummaryRequest from './editingFixSummaryRequest';
import stampWidget from './stampWidget';
import timesheet from './timesheet';

export default combineReducers({
  approvalHistory,
  dailyAttentions,
  dailyRequest,
  dailyTimeTrack,
  editingDailyAttTime,
  editingDailyRemarks,
  editingFixSummaryRequest,
  stampWidget,
  timesheet,
});
