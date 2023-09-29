import { combineReducers } from 'redux';

import approvalHistory from './approvalHistory';
import dailyAllowance from './dailyAllowance';
import dailyAttentions from './dailyAttentions';
import dailyAttTimeDialog from './dailyAttTimeDialog';
import dailyObjectivelyEventLogDialog from './dailyObjectivelyEventLogDialog';
import dailyRecordDisplayFieldLayout from './dailyRecordDisplayFieldLayout';
import dailyRequest from './dailyRequest';
import dailyTimeTrack from './dailyTimeTrack';
import editingDailyAttTime from './editingDailyAttTime';
import editingDailyRemarks from './editingDailyRemarks';
import editingFixSummaryRequest from './editingFixSummaryRequest';
import legalAgreementRequest from './legalAgreementRequest';
import loadingDailyObjectivelyEventLog from './loadingDailyObjectivelyEventLog';
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
  dailyAllowance,
  dailyAttTimeDialog,
  dailyObjectivelyEventLogDialog,
  legalAgreementRequest,
  dailyRecordDisplayFieldLayout,
  loadingDailyObjectivelyEventLog,
});
