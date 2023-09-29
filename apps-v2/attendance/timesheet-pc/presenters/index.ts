import { Store } from 'redux';

import combined from './combined';
import dailyRecord from './dailyRecord';
import fixDailyRequest from './fixDailyRequest';
import legalAgreement from './legalAgreement';
import legalAgreementRequest from './legalAgreementRequest';
import objectivelyEventLog from './objectivelyEventLog';
import stampTime from './stampTime';
import timesheet from './timesheet';

export default (
  store: Store
): {
  timesheet: ReturnType<typeof timesheet>;
  dailyRecord: ReturnType<typeof dailyRecord>;
  objectivelyEventLog: ReturnType<typeof objectivelyEventLog>;
  fixDailyRequest: ReturnType<typeof fixDailyRequest>;
  stampTime: ReturnType<typeof stampTime>;
  legalAgreement: ReturnType<typeof legalAgreement>;
  legalAgreementRequest: ReturnType<typeof legalAgreementRequest>;
  combined: ReturnType<typeof combined>;
} => ({
  timesheet: timesheet(store),
  dailyRecord: dailyRecord(store),
  objectivelyEventLog: objectivelyEventLog(store),
  fixDailyRequest: fixDailyRequest(store),
  stampTime: stampTime(store),
  legalAgreement: legalAgreement(store),
  legalAgreementRequest: legalAgreementRequest(store),
  combined: combined(store),
});
