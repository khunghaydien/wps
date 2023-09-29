import { UseCases } from '../UseCases';

export const methods: UseCases = {
  fetchTimesheet: jest.fn().mockResolvedValue({
    timesheet: 'timesheet',
  }),
  reloadTimesheetOnly: jest.fn().mockResolvedValue({
    timesheet: 'timesheet',
  }),
  fetchObjectivelyEventLogs: jest.fn().mockResolvedValue({
    objectivelyEventLogs: 'objectivelyEventLogs',
  }),
  setToBeAppliedToDailyObjectivelyEventLog: jest
    .fn()
    .mockResolvedValue('result'),
  reloadDailyObjectivelyEventLogs: jest.fn().mockResolvedValue({
    dailyObjectivelyEventLogs: ['dailyObjectivelyEventLog'],
  }),
  reloadOneDailyObjectivelyEventLog: jest.fn().mockResolvedValue({
    dailyObjectivelyEventLogs: ['dailyObjectivelyEventLog'],
  }),
  createObjectivelyEventLog: jest.fn().mockResolvedValue('result'),
  removeObjectivelyEventLog: jest.fn().mockResolvedValue('result'),
  stampTime: jest.fn().mockResolvedValue('result'),
  saveDailyRecord: jest.fn().mockResolvedValue('result'),
  saveDailyObjectivelyEventLogDeviationReason: jest
    .fn()
    .mockResolvedValue('result'),
  submitFixDailyRequest: jest.fn().mockResolvedValue('result'),
  submitFixDailyRequestWithClockOut: jest.fn().mockRejectedValue('result'),
  submitFixDailyRequestAndSaveDailyRecord: jest
    .fn()
    .mockRejectedValue('result'),
  cancelSubmittedFixDailyRequest: jest.fn().mockResolvedValue('result'),
  cancelApprovalFixDailyRequest: jest.fn().mockResolvedValue('result'),
  fetchRestTimeReasons: jest.fn().mockResolvedValue('result'),
  fetchDailyObjectivelyEventLogDeviationReasons: jest
    .fn()
    .mockResolvedValue('result'),
  fetchListLegalAgreementRequest: jest.fn().mockResolvedValue('result'),
  fetchOvertimeLegalAgreement: jest.fn().mockResolvedValue('result'),
  submitLegalAgreementRequest: jest.fn().mockResolvedValue('result'),
  reapplyLegalAgreementRequest: jest.fn().mockResolvedValue('result'),
  cancelRequestLegalAgreementRequest: jest.fn().mockResolvedValue('result'),
  cancelApprovalLegalAgreementRequest: jest.fn().mockResolvedValue('result'),
  removeLegalAgreementRequest: jest.fn().mockResolvedValue('result'),
  fetchDailyFieldLayoutTable: jest.fn().mockResolvedValue('result'),
  saveFields: jest.fn().mockResolvedValue('result'),
};

export default (): UseCases => methods;
